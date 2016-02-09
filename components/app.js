import React from 'react';
import ReactDOM from "react-dom";

import "./reset.scss"

import Room from "./rooms/Room";
import RoomList from "./rooms/RoomList";

let room = document.getElementById("room");
if(room != null) {
  ReactDOM.render(<Room host={room.getAttribute('data-host')} />, room);
}

let roomList = document.getElementById("roomList");
if(roomList != null) {
  ReactDOM.render(<RoomList host={roomList.getAttribute('data-host')} />, roomList);
}