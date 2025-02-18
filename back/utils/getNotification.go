package utils

import (
	"database/sql"
	"log"
	"real-time-forum/models"
)

func GetNotification(db *sql.DB, userID string) ([]models.GetNotification, error) {
	var notifications []models.GetNotification

	rows, err := db.Query(`
		SELECT ID, RECEIVER_ID, SENDER_ID, TYPE, RELATED_ID, CONTENT, STATUS, CREATED_AT
		FROM NOTIFICATION
		WHERE RECEIVER_ID = ?
		ORDER BY CREATED_AT DESC
	`, userID)
	if err != nil {
		log.Println("Erreur lors de la récupération des notifications :", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var notification models.GetNotification
		err := rows.Scan(
			&notification.Id,
			&notification.Sender,
			&notification.Type,
			&notification.RelatedId,
			&notification.Status,
			&notification.CreatedAt,
		)
		if err != nil {
			log.Println("Erreur lors du scan des notifications :", err)
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	// Vérifie les erreurs de `rows.Next()`
	if err = rows.Err(); err != nil {
		log.Println("Erreur lors de l'itération des notifications :", err)
		return nil, err
	}

	return notifications, nil
}
