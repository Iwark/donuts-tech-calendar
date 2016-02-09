import React from 'react';
import UserBox from "../users/_UserBox"
import MessageForm from "../messages/MessageForm"

import "./room.scss"

class Room extends React.Component {

  constructor(props) {
    super(props)

    if(!window["WebSocket"]) {
      alert("エラー: WebSocketに対応していないブラウザです。")
      return
    }
    this.socket = new WebSocket(`ws://${this.props.host}/room`);
    this.socket.onclose = () => this.onSocketClose()
    this.socket.onmessage = (e) => this.onSocketData(e)

    this.messages = [
      {text: "Hello", created: "10:00", user: { name: "Iwark", thumbnail: "https://avatars2.githubusercontent.com/u/3723159?v=3&s=460" }},
      {text: "Good Morning.", created: "10:01", user: { name: "Iwark2nd", thumbnail: "https://avatars2.githubusercontent.com/u/3723159?v=3&s=460" }},
    ];

  }

  onSocketClose() {
    console.log("接続が終了しました。");
  }

  onSocketData(e) {
    var msg = JSON.parse(e.data)
    this.messages.push({text: msg.Message, created: "10:02", user: { name: msg.Name, thumbnail: "https://avatars2.githubusercontent.com/u/3723159?v=3&s=460" }})
    this.forceUpdate()
    window.scrollTo(0, document.body.scrollHeight)
  }

  render() {
    return (
      <div className='room'>
        <ul className='messages'>
          {this.messages.map((message) => {
            return (
              <li className='message'>
                <UserBox user={message.user}/>
                <div className='message'>{message.text}</div>
                <div className='created'>{message.created}</div>
              </li>
              )
          })}
        </ul>
        <MessageForm socket={this.socket} />
      </div>
    )
  }
}

export default Room;