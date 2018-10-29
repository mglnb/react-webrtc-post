import io from "socket.io-client";
import DataChannel from "./DataChannel";

/**
 * Classe que inicializa os eventos dos sockets e faz a conexão.
 * @export
 * @class Socket
 */
class Socket {
  /**
   * Cria uma instancia de Socket e inicializa a conexão com o SocketIO.
   * @memberof Socket
   */
  constructor() {
    this.socket = io("http://localhost:3000/");
    this.userlist = [];
  }

  /**
   * Inicializa todos os eventos necessários.
   * @memberof Socket
   */
  async bindEvents() {
    return new Promise(resolve => {
      const { socket } = this;
      // Disparado assim que entra no site
      socket.on("connect", () => {
        console.log("conectado");
      });
      socket.on("my-id", id => {
        sessionStorage.setItem("me", id);
        resolve();
      });
      socket.on("client-log", console.log);

      socket.on("data-channel offer", async data => {
        await DataChannel.makeRemoteConnection(data);
      });
      socket.on("data-channel answer", async data => {
        DataChannel.setCallerRemoteDescription(data);
      });
      socket.on("new-ice-candidate", data => {
        DataChannel.handleNewIceCandidate(data)
      })
    });
  }

  /**
   * Inicializa a classe.
   * @memberof Socket
   */
  async init() {
    await this.bindEvents();
    return this;
  }
}
const SocketInstance = new Socket();
export default SocketInstance;
export const socket = SocketInstance.socket;
