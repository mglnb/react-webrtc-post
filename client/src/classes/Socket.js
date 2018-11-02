import io from "socket.io-client";
import DataChannel from "./DataChannel";

/**
 * Classe que inicializa os eventos dos sockets e faz a conexão.
 * @export
 */
class Socket {
  /**
   * Cria uma instancia de Socket e inicializa a conexão com o SocketIO.
   */
  constructor() {
    this.socket = io("http://localhost:3000/");
  }

  /**
   * Inicializa todos os eventos necessários.
   */
  async bindEvents() {
    return new Promise(resolve => {
      const { socket } = this;
      /**
       * Quando conectar, salva o id na session storage
       */
      socket.on("my-id", id => {
        sessionStorage.setItem("me", id);
        resolve();
      });
      
	    /**
       * Quando o Peer B receber a oferta,
       * chamará o makeRemoteConnection
       */
      socket.on("data-channel offer", async data => {
        await DataChannel.makeRemoteConnection(data);
      });
      
      /**
       * Quando o Peer A receber a resposta,
       * chamará a setCallerRemoteDescription
       */
      socket.on("data-channel answer", async data => {
        DataChannel.setCallerRemoteDescription(data);
      });
      
      /**
       * Tanto o Peer A quanto Peer B irão 
       * ficar adicionando IceCandidates
       */
      socket.on("new-ice-candidate", data => {
        DataChannel.handleNewIceCandidate(data);
      })
    });
  }

  /**
   * Inicializa a classe.
   */
  async init() {
    await this.bindEvents();
    return this;
  }
}
const SocketInstance = new Socket();
export default SocketInstance;

export const socket = SocketInstance.socket;
