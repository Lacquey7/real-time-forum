package models

type ResponsePost struct {
	Id        int               `json:"id"`
	User      string            `json:"username"`
	Content   string            `json:"content"`
	Likes     int               `json:"likes"`
	Dislikes  int               `json:"dislikes"`
	Comments  []ResponseComment `json:"comments"`
	Category  string            `json:"category"`
	Image     string            `json:"image"`
	CreatedAt string            `json:"created_at"`
}

type ResponseComment struct {
	Id        int    `json:"id"`
	User      string `json:"username"`
	Content   string `json:"content"`
	Likes     int    `json:"likes"`
	Dislikes  int    `json:"dislikes"`
	CreatedAt string `json:"created_at"`
}
