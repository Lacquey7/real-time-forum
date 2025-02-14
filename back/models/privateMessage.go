package models

type PrivateMessage struct {
	Sender   string
	Message  string `json:"message"`
	Receiver string `json:"receiver"`
}
