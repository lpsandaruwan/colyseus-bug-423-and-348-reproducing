import React from 'react';
import './App.css';
import { Client, Room } from "colyseus.js";
import ReactJson from "react-json-view";



const COLYSEUS_SERVER = "ws://192.168.8.163:2567";
const GAME_ROOM = "tic_tac_toe_game_room";

type CustomState = {
  client: any,
  result: any;
  room: Room
};

class App extends React.Component {
  

  state = {
    client: new Client(COLYSEUS_SERVER),
    result: [],
    room: new Room(GAME_ROOM)
  }

  callback_ = (input_: any) => {
    console.log(input_);
  }

  test = async() => {
    try {
      const result = await this.state.client.joinOrCreate(GAME_ROOM);
      result.onMessage("joined", this.callback_);
      result.onMessage('rejoined', this.callback_);
      console.log(result);
      this.setState({room: result});
    } catch (e) {
      console.error("join error", e);
    }
  };

  async componentDidMount() {
    await this.test();
    setInterval(async() => {
      try { 
        const readyState = (this.state.room.connection.transport as any).ws.readyState;
        if(readyState == 1) {
        this.state.room.send('rejoined', {'ses': this.state.room.sessionId});
        }
        else if(readyState == 2 || readyState == 3) {
          console.log("disconnected");
          const room_ = await this.state.client.reconnect(this.state.room.id, this.state.room.sessionId);
          room_.onMessage("joined", this.callback_);
          room_.onMessage('rejoined', this.callback_);
          this.setState({ room: room_});
          console.log(room_);
          room_.send('rejoined', {'client': room_});
        }
      }
      catch(e) {
        console.error("getAvailableRooms error", e);

      }

    }, 2000)
    
  }
  render() {
    return (
      <div className="App">
      <ReactJson src={this.state.room}></ReactJson>
    </div>
    )
  }
}

export default App;
