import React from 'react';

import "./message_form.scss"

class MessageForm extends React.Component {

  constructor(props) {
    super(props)
    this.stampIsActive = true;
    this.cursorPos = 2;
  }

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

  onChange() {
    var currentCursor = this.refs.message.value.split('\n').length;
   
    if (this.cursorPos > currentCursor) {
      if (this.refs.message.rows > 2) {
        this.refs.message.rows -= 1;
      }
    }
    this.cursorPos = currentCursor;
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
    this.cursorPos = 2;
    this.forceUpdate()
  }

  onStampClick() {
    if (this.stampIsActive) {
      this.stampIsActive = false;
      this.refs.stampArea.setAttribute('class', 'stamp-area active')
    } else {
      this.stampIsActive = true;
      this.refs.stampArea.setAttribute('class', 'stamp-area inactive')
    }
  }

  render() {
    return (

        <div className="message-area">
          <form className="message-form" onSubmit={(e) => this.onSubmit(e)}>
            <textarea 
              className="form-control" 
              ref="message" 
              onKeyDown={(e) => this.onKeyDown(e)}
              onChange={() => this.onChange()} />
            <img className="stamp-btn" src={require('./stamp-btn.png')} onClick={() => this.onStampClick()}/>
            <input className="submit-btn" ref="btn" type="submit" value="送信" />
          </form>
          <div className='stamp-area' ref="stampArea">
            <img className="stamp" src={require('./stamp01.png')}/>
            <img className="stamp" src={require('./stamp02.png')}/>
            <img className="stamp" src={require('./stamp03.png')}/>
          </div>
        </div>

    )
  }
}

export default MessageForm;
