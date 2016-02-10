package main

import "time"

// message represents a single message
type message struct {
	Type    string // "message", "stamp"
	User    *User
	Message string
	When    time.Time
}
