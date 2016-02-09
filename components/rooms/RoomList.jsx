import React from 'react';

import "./roomList.scss"

class RoomList extends React.Component {

  render() {
    return (
      <ul className="room-list">
        <li className="room">
          <h2 className="room-name">Go勉強会#2</h2>
          <div className="date">2016/02/11</div>
          <img className="icon" src={require("./gopher.png")} />
          <div className="join-btn">参加する</div>
        </li>
      </ul>
    );
  }
}

export default RoomList;