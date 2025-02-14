package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/models"
	"real-time-forum/services"
	"real-time-forum/utils"
)

func PrivateMessage(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Missing cookie")
		return
	}

	checkSession, userID := utils.CheckSession(db, cookie.Value)
	if !checkSession {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Session invalid")
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleGetMessage(db, w, r, userID)
	case http.MethodPost:
		handleCreateMessage(db, w, r, userID)

	default:
		utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
	}
}

func handleCreateMessage(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {
	var messageStruc models.PrivateMessageReceived

	// Décodage du JSON reçu
	err := json.NewDecoder(r.Body).Decode(&messageStruc)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Format JSON invalide pour l'envoi du message")
		return
	}

	// Vérifier que le message et le destinataire ne sont pas vides
	if messageStruc.Message == "" || messageStruc.Receiver == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Le message et le destinataire sont obligatoires")
		return
	}

	// Récupérer l'ID du destinataire à partir de son username
	userId2 := utils.GetUserIDbyUsername(db, messageStruc.Receiver)
	if userId2 == "" {
		utils.SendErrorResponse(w, http.StatusNotFound, "Utilisateur destinataire non trouvé")
		return
	}

	// Vérifier / Créer une conversation entre les deux utilisateurs
	convId, err := services.InsertNewConv(db, userId, userId2)
	if err != nil {
		log.Println("Erreur lors de la récupération/création de la conversation :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur interne lors de la gestion de la conversation")
		return
	}

	// Insérer le message dans la conversation
	messageId, err := services.InsertNewMessage(db, convId, userId, messageStruc.Message)
	if err != nil {
		log.Println("Erreur lors de l'insertion du message :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur interne lors de l'envoi du message")
		return
	}

	// Répondre avec l'ID du message inséré
	response := map[string]interface{}{
		"message":         "Message envoyé avec succès",
		"message_id":      messageId,
		"conversation_id": convId,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func handleGetMessage(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {

}
