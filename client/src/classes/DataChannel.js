import { peerConfig } from "../util/config";
import { socket } from "./Socket";

export default new class DataChannel {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.caller = null;
    this.receiver = null;

    this.resolve = null;
  }

  /**
   * Inicia a conexão
   * @param {Object} peers
   * @param {String} peers.caller
   * @param {String} peers.receiver
   */
  makeConnection({ caller, receiver }) {
    return new Promise(async resolve => {
      this.resolve = resolve;
      this.caller = caller;
      this.receiver = receiver;

      this.connection = new RTCPeerConnection(peerConfig);

      this.connection.onicecandidate = e =>
        e.candidate &&
        socket.emit("new-ice-candidate", {
          ice: e.candidate,
          caller: this.caller,
          receiver: this.receiver
        });

      this.createDataChannel();

      const offer = await this.connection.createOffer();
      this.connection.setLocalDescription(offer);

      socket.emit("data-channel offer", {
        caller: this.caller,
        receiver: this.receiver,
        sdp: offer
      });
    });
  }
  /**
   * @param {MessageEvent} ev
   */
  appendMessage({ data }) {
    const $messages = document.getElementById("messages");
    $messages.insertAdjacentHTML("beforeend",`<p> ${this.receiver} falou: ${data} </p>`);
  }
  /**
   * Criando e adicionando handlers do evento
   */
  createDataChannel() {
    this.channel = this.connection.createDataChannel("dataChannel");
    this.channel.onopen = console.warn;
    this.channel.onclose = console.error;
    this.channel.onmessage = this.appendMessage.bind(this);
  }

  /**
   * Quando volta a resposta do receiver
   * é necessário adicionar a RemoteSessionDescription
   * @param {Object} data
   * @param {RTCSessionDescription} data.sdp
   */
  setCallerRemoteDescription({ sdp }) {
    this.connection.setRemoteDescription(sdp);
    this.resolve(this.channel);
    socket.emit("data-channel connected", {
      receiver: this.receiver,
      caller: this.caller
    });
  }

  // -----------------------
  // -- Remote Connection --
  // -----------------------

  /**
   * Inicia a conexão remota
   * @param {Object} data
   * @param {String} data.caller
   * @param {String} data.receiver
   * @param {RTCSessionDescription} data.sdp
   */
  async makeRemoteConnection({ caller, receiver, sdp }) {
    this.caller = receiver;
    this.receiver = caller;
    this.connection = new RTCPeerConnection(peerConfig);

    this.connection.ondatachannel = this.handleReceiverChannel.bind(this);

    this.connection.onicecandidate = e =>
      e.candidate &&
      socket.emit("new-ice-candidate", {
        ice: e.candidate,
        caller: this.caller,
        receiver: this.receiver
      });

    await this.connection.setRemoteDescription(sdp);
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    socket.emit("data-channel answer", {
      caller,
      receiver,
      sdp: answer
    });
  }

  /**
   *
   * @param {Object} data
   * @param {RTCIceCandidate} ice
   */
  async handleNewIceCandidate({ ice }) {
    await this.connection.addIceCandidate(ice);
  }

  /**
   * Quando chegar todas informações do outro Peer
   * Será lançado o evento ondatachannel
   * no qual esta função serve de handler
   * @param {Object} e
   * @param {RTCDataChannel} e.channel
   */
  handleReceiverChannel({ channel }) {
    this.channel = channel;
    this.channel.onopen = console.warn;
    this.channel.onclose = console.error;
    this.channel.onmessage = this.appendMessage.bind(this);
  }
}();
