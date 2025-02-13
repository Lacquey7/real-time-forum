package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/models"
	"real-time-forum/services"
	"real-time-forum/utils"
)

func Post(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case http.MethodPost:
		handleCreatePost(w, r, db)
	case http.MethodGet:
		handleGetPosts(w, r, db)
	default:
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
	}
}

func handleCreatePost(w http.ResponseWriter, r *http.Request, db *sql.DB) {
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

	var post models.Post
	err = json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Format JSON invalide pour la création de post")
		return
	}

	err = services.InsertPost(db, userID, post.Content, post.Category, post.Image)
	if err != nil {
		log.Printf("Erreur lors de l'insertion du post : %v", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de l'insertion du post")
		return
	}

	// Réponse avec statut 201 et message de succès
	response := map[string]string{
		"status":  "Created",
		"message": "Post inséré avec succès",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func handleGetPosts(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Missing cookie")
		return
	}

	checkSession, _ := utils.CheckSession(db, cookie.Value)
	if !checkSession {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Session invalid")
		return
	}

	posts, err := utils.GetPostsWithComments(db)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la récupération des posts")
		return
	}

	fmt.Println("Posts récupérés :", posts) // ✅ Vérification

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)

}
