package websocketFile

import "database/sql"

func isValidSession(db *sql.DB, sessionID string) bool {
	var userID string
	err := db.QueryRow("SELECT USERID FROM SESSION WHERE ID = ?", sessionID).Scan(&userID)
	return err == nil // Si aucun erreur, la session est valide
}
