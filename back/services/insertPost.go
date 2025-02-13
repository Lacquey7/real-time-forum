package services

import (
	"database/sql"
	"fmt"
)

// InsertPost ajoute un post dans la base de données.
func InsertPost(db *sql.DB, userID, content, category, image string) error {
	query := `INSERT INTO POST (USER_ID, CONTENT, CATEGORY, IMAGE) 
	          VALUES (?, ?, ?, ?)`

	_, err := db.Exec(query, userID, content, category, image)
	if err != nil {
		return fmt.Errorf("erreur lors de l'insertion en base de données : %w", err)
	}

	return nil
}
