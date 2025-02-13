package utils

import (
	"database/sql"
	"log"
	"real-time-forum/models"
)

// GetPostsWithComments récupère tous les posts avec leurs commentaires associés.
func GetPostsWithComments(db *sql.DB) ([]models.ResponsePost, error) {
	var posts []models.ResponsePost

	// Requête SQL pour récupérer les posts avec leurs likes/dislikes et le username
	rows, err := db.Query(`
		SELECT p.ID, u.USERNAME, p.CONTENT, p.IMAGE, p.CATEGORY, p.CREATED_AT,
		       COALESCE(l.Likes, 0) AS Likes, COALESCE(d.Dislikes, 0) AS Dislikes
		FROM POST p
		JOIN USER u ON p.USER_ID = u.ID
		LEFT JOIN (SELECT POST_ID, COUNT(*) AS Likes FROM LIKES GROUP BY POST_ID) l ON p.ID = l.POST_ID
		LEFT JOIN (SELECT POST_ID, COUNT(*) AS Dislikes FROM DISLIKE GROUP BY POST_ID) d ON p.ID = d.POST_ID
		ORDER BY p.CREATED_AT DESC
	`)
	if err != nil {
		log.Println("Erreur lors de la récupération des posts:", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		log.Println("Un post a été trouvé !") // ✅ Vérification
		var post models.ResponsePost
		if err := rows.Scan(&post.Id, &post.User, &post.Content, &post.Image, &post.Category, &post.CreatedAt, &post.Likes, &post.Dislikes); err != nil {
			log.Println("Erreur lors du scan des posts:", err)
			return nil, err
		}

		// Récupération des commentaires associés au post
		comments, err := GetCommentsByPostID(db, post.Id)
		if err != nil {
			log.Println("Erreur lors de la récupération des commentaires:", err)
			return nil, err
		}

		post.Comments = comments
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		log.Println("Erreur lors de l'itération des posts:", err)
		return nil, err
	}

	return posts, nil
}

// GetCommentsByPostID récupère tous les commentaires associés à un post donné.
func GetCommentsByPostID(db *sql.DB, postID int) ([]models.ResponseComment, error) {
	var comments []models.ResponseComment

	rows, err := db.Query(`
		SELECT c.ID, u.USERNAME, c.CONTENT, 
		       COALESCE(l.Likes, 0) AS Likes, COALESCE(d.Dislikes, 0) AS Dislikes, c.CREATED_AT
		FROM COMMENT c
		JOIN USER u ON c.USERID = u.ID
		LEFT JOIN (SELECT COMMENT_ID, COUNT(*) AS Likes FROM LIKE_COMMENT GROUP BY COMMENT_ID) l ON c.ID = l.COMMENT_ID
		LEFT JOIN (SELECT COMMENT_ID, COUNT(*) AS Dislikes FROM DISLIKE_COMMENT GROUP BY COMMENT_ID) d ON c.ID = d.COMMENT_ID
		WHERE c.POST_ID = ?
		ORDER BY c.CREATED_AT ASC
	`, postID)
	if err != nil {
		log.Println("Erreur lors de la récupération des commentaires pour le post", postID, ":", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.ResponseComment
		if err := rows.Scan(&comment.Id, &comment.User, &comment.Content, &comment.Likes, &comment.Dislikes, &comment.CreatedAt); err != nil {
			log.Println("Erreur lors du scan des commentaires:", err)
			return nil, err
		}
		comments = append(comments, comment)
	}

	if err = rows.Err(); err != nil {
		log.Println("Erreur lors de l'itération des commentaires:", err)
		return nil, err
	}

	return comments, nil
}
