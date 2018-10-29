import React, { Component } from "react";
import Socket, { socket } from "../classes/Socket";
import "./App.css";
import DataChannel from "../classes/DataChannel";

class App extends Component {
  state = {
    users: [],
    me: null
  };
  async componentWillMount() {
    socket.on("users", users => {
      this.setState({ users });
    });
    await Socket.init();
    this.setState({ me: sessionStorage.getItem("me") });
  }
  handleCall = e => {
    DataChannel.caller = this.state.me
    DataChannel.receiver = e.target.innerText
    DataChannel.makeConnection();
  };
  render() {
    return (
      <div>
        {this.state.users.map(user => (
          <button
            key={user}
            onClick={this.handleCall}
            disabled={this.state.me === user}
          >
            {user}
          </button>
        ))}
      </div>
    );
  }
}

export default App;
