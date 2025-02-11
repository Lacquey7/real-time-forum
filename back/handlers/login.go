package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
)

// Login prend `db` en paramètre
func Login(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method == "GET" {
		if db == nil {
			http.Error(w, "Erreur : base de données non disponible", http.StatusInternalServerError)
			return
		}

		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM USER").Scan(&count)
		if err != nil {
			http.Error(w, "Erreur lors de l'accès à la base de données", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Nombre d'utilisateurs : %d", count)
	} else {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
	}
}
