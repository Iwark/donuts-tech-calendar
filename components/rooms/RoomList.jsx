import React from 'react';

import { Link } from 'react-router';

import "./room_list.scss"

class RoomList extends React.Component {

  render() {
    return (
      <ul className="room-list">
        <li className="room">
          <h2 className="room-name">Go勉強会#2</h2>
          <div className="date">2016/02/10</div>
          <img className="icon" src={require("./gopher.png")} />
          <Link to="/login"><div className="join-btn">参加する</div></Link>
        </li>
      </ul>
    );
  }
}

export default RoomList;