package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gofrs/uuid"
)

type RegisterInsert struct {
	ID        string
	Email     string `json:"email"`
	Password  string `json:"password"`
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Age       string `json:"age"`
	Genre     string `json:"genre"`
}

func Register(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	if db == nil { 
		http.Error(w, "Erreur : base de données non disponible", http.StatusInternalServerError)
		return
	}

	var user RegisterInsert
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, "Erreur lors du décodage du JSON", http.StatusBadRequest)
		return
	}
	
	defer r.Body.Close()

	u, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Erreur lors de la génération de l'UUID", http.StatusInternalServerError)
		return
	}
	user.ID = u.String()

	query := "INSERT INTO USER (ID, EMAIL, PASSWORD, USERNAME, FIRSTNAME, LASTNAME, AGE, GENRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	_, err = db.Exec(query, user.ID, user.Email, user.Password, user.Username, user.FirstName, user.LastName, user.Age, user.Genre)
	if err != nil {
		http.Error(w, "Erreur lors de l'insertion en base de données", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(fmt.Sprintf("Utilisateur %s créé avec succès", user.Username)))
}
