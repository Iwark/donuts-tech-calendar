import React from 'react';
import { render } from "react-dom";

import { Router, Route, IndexRoute, Link } from 'react-router';

import "./reset.scss"
import "./app.scss"

import Room from "./rooms/Room";
import RoomList from "./rooms/RoomList";
import Login from "./users/Login";

const App = React.createClass({
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
            <div className="navbar-header">
              <a className="navbar-brand" href="/index">
                <img className="logo" src={require('./logo.png')} />
              </a>
            </div>
        </nav>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
})

var wrapComponent = function(Component, props) {
  return React.createClass({
    render: function() {
      return React.createElement(Component, props);
    }
  });
};

let container = document.getElementById("container")

render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={RoomList} />
      <Route path= "login" component={Login} />
      <Route path="chat" component={wrapComponent(Room, {host: container.getAttribute('data-host')})}/>   
    </Route>
  </Router>
), container)