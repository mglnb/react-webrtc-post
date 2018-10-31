import React, { Component } from "react";
import Socket, { socket } from "../classes/Socket";
import "./App.css";
import DataChannel from "../classes/DataChannel";

class App extends Component {
  state = {
    users: [],
    me: null,
    channel: null,
    message: "",
    receiver: ""
  };
  async componentWillMount() {
    socket.on("users", users => {
      this.setState({ users });
    });
    socket.on("data-channel connected", () => {
      setTimeout(() => {
        this.setState({ channel: DataChannel.channel });
      }, 300);
    });
    await Socket.init();
    this.setState({ me: sessionStorage.getItem("me") });
  }
  handleCall = async e => {
    this.setState({
      receiver: e.target.innerText,
      channel: await DataChannel.makeConnection({
        caller: this.state.me,
        receiver: e.target.innerText
      })
    });
  };

  sendMessage = e => {
    if (e.which === 13) {
      this.state.channel.send(this.state.message);
      this.refs.messages.insertAdjacentHTML("beforeend",`<p>Você falou: ${this.state.message}</p>`);
      this.setState({ message: "" });
    }
  };

  setValue = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { channel, me } = this.state;
    return (
      <div>
        {this.state.users.map(user => (
          <button key={user} onClick={this.handleCall} disabled={me === user}>
            {user}
          </button>
        ))}

        {channel && (
          <div>
            <input
              type="text"
              data-user={me}
              name="message"
              value={this.state.message}
              onChange={this.setValue}
              onKeyPress={this.sendMessage}
            />
          </div>
        )}

        <div id="messages" ref="messages" />
      </div>
    );
  }
}

export default App;
