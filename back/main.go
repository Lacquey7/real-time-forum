package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./database/real-time-forum.db")
	if err != nil {
		log.Fatalf("Erreur de connexion à la base de données : %v", err)
	}
	defer db.Close()
	
}
