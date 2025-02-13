package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/services"
	"real-time-forum/utils"
	"time"
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
	defer r.Body.Close()

	success, userID := checkDataLogin(db, user.Email, user.Password)
	if !success {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "L'email ou le mot de passe est incorrect")
		return
	}

	// Création du token de session
	sessionToken, err := services.CreateSessionToken(db, userID)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la création du token de session")
		return
	}

	// Définir un cookie HTTP-Only pour stocker la session
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,  // Empêche l'accès via JavaScript (protection XSS)
		Secure:   false, // Mettre true en production (HTTPS obligatoire)
		SameSite: http.SameSiteStrictMode,
		Path:     "http://127.0.0.1:5500/",
	})

	// Réponse JSON au client
	response := map[string]string{
		"message": "Connexion réussie",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func checkDataLogin(db *sql.DB, email, password string) (bool, string) {
	// Vérification de l'email valide
	if !utils.IsvalidEmail(email) {
		fmt.Println("Email invalide")
		return false, ""
	}

	var userID, hashedPassword string
	query := `SELECT id, password FROM user WHERE email = ?`
	err := db.QueryRow(query, email).Scan(&userID, &hashedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Println("Aucun utilisateur trouvé avec cet email :", email)
		} else {
			log.Println("Erreur lors de la récupération des informations de l'utilisateur :", err)
		}
		return false, ""
	}

	// Vérification du mot de passe
	if err := utils.CheckPassword(password, hashedPassword); err != nil {
		fmt.Println("Mot de passe incorrect")
		return false, ""
	}

	// Retourne true et l'ID de l'utilisateur si tout est correct
	return true, userID
}
