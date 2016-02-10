package main

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// チャットを行っている１人のユーザー
type client struct {
	// socketは、このクライアントのためのwebsocket
	socket *websocket.Conn
	// sendは、メッセージが送られるチャネル
	send chan *message
	// roomは、このクライアントが参加しているチャットルーム
	room *room
	// userNameはユーザー名を保持します
	userName string
}

func (c *client) read() {
	for {
		var msg *message
		if err := c.socket.ReadJSON(&msg); err == nil {
			user, err := FindUser(c.userName)
			if err != nil {
				log.Fatal(err)
			} else {
				msg.User = user
				msg.When = time.Now()
				c.room.forward <- msg
			}
		} else {
			break
		}
	}
	c.socket.Close()
}

func (c *client) write() {
	for msg := range c.send {
		if err := c.socket.WriteJSON(msg); err != nil {
			break
		}
	}
	c.socket.Close()
}
