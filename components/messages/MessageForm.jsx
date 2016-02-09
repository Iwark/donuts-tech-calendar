import React from 'react';

class MessageForm extends React.Component {
  onSubmit(e) {
    e.preventDefault();
    let mes = this.refs.message.value;
    if(!mes) return;
    console.log(this.props)
    this.props.socket.send(JSON.stringify({
      Message: mes
    }));
    this.refs.message.value = ''
    this.forceUpdate()
  }
  render() {
    return (
      <form className="message-form" onSubmit={(e) => this.onSubmit(e)}>
        <textarea ref="message"></textarea>
        <input type="submit" value="送信" />
      </form>
    )
  }
}

export default MessageForm;