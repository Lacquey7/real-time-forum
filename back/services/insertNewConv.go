package services

import (
	"database/sql"
	"github.com/gofrs/uuid"
	"log"
)

func InsertNewConv(db *sql.DB, userId1, userId2 string) (string, error) {
	var convId string

	// Vérifier si une conversation existe déjà avec ces deux utilisateurs
	query := `
		SELECT id FROM CONVERSATION 
		WHERE (USER1ID = ? AND USER2ID = ?) OR (USER2ID = ? AND USER1ID = ?)
	`
	err := db.QueryRow(query, userId1, userId2, userId2, userId1).Scan(&convId)

	if err == nil {
		// Si une conversation existe déjà, on retourne son ID
		return convId, nil
	} else if err != sql.ErrNoRows {
		// S'il y a une autre erreur, on la log
		log.Println("Erreur lors de la vérification de la conversation :", err)
		return "", err
	}

	insertQuery := `INSERT INTO CONVERSATION (ID ,USER1ID, USER2ID) VALUES (?,?, ?)`
	convUUID, _ := uuid.NewV4()
	convId = convUUID.String()
	_, err = db.Exec(insertQuery, convId, userId1, userId2)
	if err != nil {
		log.Println("Erreur lors de l'insertion de la conversation :", err)
		return "", err
	}

	return convId, nil
}
