package main

import (
	"database/sql"
	"log"
	"net/http"
	"real-time-forum/routes"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./database/real-time-forum.db")
	if err != nil {
		log.Fatalf("Erreur de connexion à la base de données : %v", err)
	}
	defer db.Close()

	mux := http.NewServeMux()
	routes.SetupRoutes(mux, db) // On passe `db`

	log.Println("Serveur démarré sur le port 8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
