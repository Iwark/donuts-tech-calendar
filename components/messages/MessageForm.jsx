import React from 'react';

import "./messageForm.scss"

class MessageForm extends React.Component {

  onKeyDown(e) {
    // Enterを押した時
    if (e.keyCode == 13) {
      // シフトキーが押されている場合
      if (e.shiftKey) {
        this.refs.message.rows += 1;
      } else {
        e.preventDefault()
        this.refs.btn.click();
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let mes = this.refs.message.value;
    if(!mes) return;
    this.props.socket.send(JSON.stringify({
      Message: mes
    }));
    this.refs.message.value = '';
    this.refs.message.rows  = 2;
    this.forceUpdate()
  }


  render() {
    return (
      <div className="message-area">
        <form className="message-form" onSubmit={(e) => this.onSubmit(e)}>
          <textarea className="form-control" ref="message" onKeyDown={(e) => this.onKeyDown(e)}/>
          <img className="stamp" src={require('./stamp.png')}/>
          <input className="submit-btn" ref="btn" type="submit" value="送信" />
        </form>
      </div>
    )
  }
}

export default MessageForm;
