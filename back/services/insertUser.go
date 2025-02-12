package services

import (
	"database/sql"
	"fmt"
)

// InsertUser insère un utilisateur dans la base de données.
func InsertUser(db *sql.DB, id, email, hashedPass, username, firstname, lastname, age, genre string) error {
	query := "INSERT INTO USER (ID, EMAIL, PASSWORD, USERNAME, FIRSTNAME, LASTNAME, AGE, GENRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"

	_, err := db.Exec(query, id, email, hashedPass, username, firstname, lastname, age, genre)
	if err != nil {
		return fmt.Errorf("erreur lors de l'insertion en base de données : %w", err)
	}

	return nil
}
