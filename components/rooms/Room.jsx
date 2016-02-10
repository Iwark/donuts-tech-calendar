import React from 'react';
import UserBox from "../users/_UserBox"
import MessageForm from "../messages/MessageForm"

import "./room.scss"

class Room extends React.Component {

  constructor(props) {
    super(props)

    this.host = document.getElementById("container").getAttribute('data-host')

    if(!window["WebSocket"]) {
      alert("エラー: WebSocketに対応していないブラウザです。")
      return
    }
    this.socket = new WebSocket(`ws://${this.host}/room`);
    this.socket.onclose = () => this.onSocketClose()
    this.socket.onmessage = (e) => this.onSocketData(e)

    this.messages = [];

  }

  onSocketClose() {
    console.log("接続が終了しました。");
  }

  onSocketData(e) {
    console.log(e.data);
    let msg = JSON.parse(e.data);
    let created = new Date(msg.When);
    this.messages.push({type: msg.Type, text: msg.Message, created: created.toLocaleString(), user: { name: msg.User.Name, thumbnail: msg.User.AvatarURL }})
    this.forceUpdate()
    window.scrollTo(0, document.body.scrollHeight)
  }

  render() {
    return (
      <div className='room'>
        <ul className='messages'>
          {this.messages.map((message) => {
            if(message.type == "message"){
              return (
                <li className='message'>
                  <UserBox user={message.user}/>
                  <div className='message'>{message.text}</div>
                  <div className='created'>{message.created}</div>
                </li>
              )
            } else {
              return (
                <li className='message'>
                  <UserBox user={message.user}/>
                  <div className='message'><img src={message.text}/></div>
                  <div className='created'>{message.created}</div>
                </li>
              )
            }
          })}
        </ul>
        <MessageForm socket={this.socket} />
      </div>
    )
  }
}

export default Room;