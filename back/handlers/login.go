package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"real-time-forum/utils"
)

type LoginCheck struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login prend `db` en paramètre
func Login(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	if r.Method != http.MethodPost {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	if db == nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur : base de données non disponible")
		return
	}

	var user LoginCheck
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors du décodage du JSON")
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(r.Body)

	if !checkDataLogin(db, user.Email, user.Password) {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "L'email ou le mot de passe incorrect")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(map[string]string{
		"message": fmt.Sprintf("Utilisateur connecté"),
	})
	if err != nil {
		return
	}
}

func checkDataLogin(db *sql.DB, email, password string) bool {
	// Vérification de l'email valide
	if !utils.IsvalidEmail(email) {
		fmt.Println("Email invalide")
		return false
	}

	var hashedPassword string
	query := `SELECT password FROM user WHERE email = ?`
	err := db.QueryRow(query, email).Scan(&hashedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			fmt.Println("Aucun utilisateur trouvé avec cet email")
		} else {
			log.Println("Erreur lors de la récupération du mot de passe :", err)
		}
		return false
	}

	// Vérification du mot de passe
	err = utils.CheckPassword(password, hashedPassword)
	if err != nil {
		fmt.Println("Mot de passe incorrect")
		return false
	}

	return true
}
