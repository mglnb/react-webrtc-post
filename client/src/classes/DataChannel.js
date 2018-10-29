import { peerConfig } from "../util/config";
import { socket } from "./Socket";
/**
 * @class
 */
class DataChannel {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.caller = null;
    this.receiver = null;
  }
  async makeConnection() {
    this.connection = new RTCPeerConnection(peerConfig);

    this.connection.onicecandidate = this.handleIceCandidate.bind(this);

    this.createDataChannel();

    const offer = await this.connection.createOffer();
    this.connection.setLocalDescription(offer);

    socket.emit("data-channel offer", {
      caller: this.caller,
      receiver: this.receiver,
      sdp: offer
    });
  }

  handleIceCandidate(e) {
    if (e.candidate) {
      console.log("offer ice", e.candidate);
      socket.emit("new-ice-candidate", {
        ice: e.candidate,
        caller: this.caller,
        receiver: this.receiver
      });
    }
  }

  createDataChannel() {
    this.channel = this.connection.createDataChannel("dataChannel");
    this.channel.onopen = this.handleChannelStatusChange.bind(this);
    this.channel.onclose = this.handleChannelStatusChange.bind(this);
  }
  handleChannelStatusChange(e) {
    console.log("channel created \n\n\n\n\n\n", e);
  }

  setCallerRemoteDescription({ sdp }) {
    this.connection.setRemoteDescription(sdp);
  }

  // Remote Connection

  /**
   * @param {Object} data
   */
  async makeRemoteConnection({ caller, receiver, sdp }) {
    this.caller = receiver;
    this.receiver = caller;
    this.connection = new RTCPeerConnection(peerConfig);

    this.connection.ondatachannel = this.handleReceiverChannel.bind(this);
    this.connection.onicecandidate = this.handleIceCandidate.bind(this);

    await this.connection.setRemoteDescription(sdp);
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    socket.emit("data-channel answer", {
      caller,
      receiver,
      sdp: answer
    });
  }

  async handleNewIceCandidate({ ice }) {
    if (!this.connection.remoteDescription) {
      await this.connection.addIceCandidate(ice);
    }
    console.log("ice", this.connection.remoteDescription);
  }

  handleReceiverChannel(e) {
    console.log("channel\n\n\n\n", e);
  }
}
const channel = new DataChannel();
window.dc = channel;
export default channel;
