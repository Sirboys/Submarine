import React from 'react';
import './Game.scss';
import './../../index.css';

import socket from '../../helpers/socket';

class Game extends React.Component {
  constructor(props) {
    super();
    this.MESSAGES = props.MESSAGES;
    this.setAuthState = props.setAuthState;
    this.state = {
      messages: []
    };
    socket.on(this.MESSAGES.NEW_MESSAGE, (data) => this.newMessage(data));
    socket.on(this.MESSAGES.TEAM_LIST, (data) => console.log(data));
    socket.on(this.MESSAGES.REMOVE_TEAM, (data) => console.log(data));
  }

  sendMessage() {
    const message = document.querySelector('#message').value;
    socket.emit(this.MESSAGES.NEW_MESSAGE, { token : localStorage.getItem('token'), message });
  }

  newMessage(data) {
    this.setState((state) => {
      let messages = state.messages;
      messages.push({
        message: data.message,
        name: data.name
      });
      return { messages }
    });
  }
  
  addToRoom() {
    const room = document.querySelector('#room').value;
    if(room) {
        socket.emit(this.MESSAGES.ADD_TO_ROOM, { token: localStorage.getItem('token'), room });
    }
  }

  renderMessages() {
    return (
      this.state.messages.map(mess => <div><b>{ mess.name }</b> : { mess.message }</div>)
    );
  }

  logout() {
    socket.emit(this.MESSAGES.USER_LOGOUT, { token : localStorage.getItem('token') });
    localStorage.removeItem('token');
    this.setAuthState(false);
  }

  createRoom() {
    socket.emit(this.MESSAGES.CREATE_TEAM, { 
      token: localStorage.getItem('token'),
      name: 'белая стрекоза'
    });
  }

  deleteRoom() {
    socket.emit(this.MESSAGES.REMOVE_TEAM, { 
      token: localStorage.getItem('token')
    });
  }

  render() {
    return (
      <div>
        <div>
        <input id="message" placeholder="Message"/>
        <button id="newMessage" onClick = {() => this.sendMessage()}>Послать</button>
        <div id="chat"> { this.renderMessages() }</div>
        </div>
        <div>
        <input id="room" placeholder="Room"/>
        <button id="addToRoom" onClick = { () => this.addToRoom() }>Добавиться</button>
        </div>
        <br/>
        <button id="userLogout" onClick = { () => this.logout() }>Logout</button>
        <button id="createRoom" onClick = { () => this.createRoom() }>create Room</button>
        <button id="deleteRoom" onClick = { () => this.deleteRoom() }>delete Room</button>
      </div>
    );
  }
}

export default Game;