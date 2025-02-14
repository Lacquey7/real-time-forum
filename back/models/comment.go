package models

type Comment struct {
	Id        int
	User      string
	Content   string `json:"content"`
	Likes     int
	Dislikes  int
	CreatedAt string
}
