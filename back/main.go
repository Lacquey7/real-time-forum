package main

import (
	"database/sql"
	"net/http"
	"real-time-forum/routes"

	_ "github.com/mattn/go-sqlite3"
	"log"
)

func main() {
	db, err := sql.Open("sqlite3", "./database/real-time-forum.db")
	if err != nil {
		log.Fatalf("Erreur de connexion à la base de données : %v", err)
	}
	defer db.Close()

	mux := http.NewServeMux()
	routes.SetupRoutes(mux)

	http.ListenAndServe(":8080", nil)

}
