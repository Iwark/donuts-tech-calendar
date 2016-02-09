import React from 'react';
import ReactDOM from "react-dom";

import "./reset.scss"

import Room from "./rooms/Room";

let room = document.getElementById("room");
ReactDOM.render(<Room host={room.getAttribute('data-host')} />, room);