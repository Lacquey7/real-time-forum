package models

import "github.com/gorilla/websocket"

type Message struct {
	Type    string          `json:"type"`
	Content string          `json:"content"`
	Sender  *websocket.Conn `json:"-"`
}

type UserStatus struct {
	Type    string          `json:"type"`
	Content []string        `json:"content"`
	Sender  *websocket.Conn `json:"-"`
}
