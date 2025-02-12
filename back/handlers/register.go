package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gofrs/uuid"
	"net/http"
	"real-time-forum/utils"
	"regexp"
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
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur : base de données non disponible")
		return
	}

	var user RegisterInsert
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors du décodage du JSON")
		return
	}
	defer r.Body.Close()

	u, err := uuid.NewV4()
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la génération de l'UUID")
		return
	}
	user.ID = u.String()

	hashedPass, err := utils.HashPassword(user.Password)
	if err != nil {
		fmt.Printf("Erreur lors du hashage : %v\n", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors du traitement interne")
		return
	}

	// Vérifie que l'email et le username sont disponibles
	if !checkData(db, user.Email, user.Username) {
		utils.SendErrorResponse(w, http.StatusConflict, "L'email ou le nom d'utilisateur existe déjà")
		return
	}

	// Insertion des données de l'utilisateur dans la base
	query := "INSERT INTO USER (ID, EMAIL, PASSWORD, USERNAME, FIRSTNAME, LASTNAME, AGE, GENRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	_, err = db.Exec(query, user.ID, user.Email, hashedPass, user.Username, user.FirstName, user.LastName, user.Age, user.Genre)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de l'insertion en base de données")
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": fmt.Sprintf("Utilisateur %s créé avec succès", user.Username),
	})
}

func checkData(db *sql.DB, email, username string) bool {
	if !isValidEmail(email) {
		fmt.Println("Email invalide")
		return false
	}

	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM USER WHERE EMAIL = ? OR USERNAME = ?)`
	err := db.QueryRow(query, email, username).Scan(&exists)
	if err != nil {
		fmt.Printf("Erreur lors de la vérification des données : %v\n", err)
		return false
	}

	// Retourne vrai si l'email et le username ne sont PAS déjà utilisés
	return !exists
}

func isValidEmail(email string) bool {
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(email)
}
