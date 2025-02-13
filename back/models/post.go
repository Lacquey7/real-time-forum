package models

import "time"

type Post struct {
	ID        int
	UserId    string
	Content   string `json:"content"`
	Like      int
	Dislike   int
	Comment   int
	Category  string `json:"category"`
	Image     string
	CreatedAt time.Time
}
