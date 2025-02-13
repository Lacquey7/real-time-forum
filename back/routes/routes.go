package routes

import (
	"database/sql"
	"net/http"
	"real-time-forum/handlers"
	"real-time-forum/websocket" // Import du package WebSocket
)

// Ajout de `hub *websocket.Hub` en paramètre
func SetupRoutes(mux *http.ServeMux, db *sql.DB, hub *websocket.Hub) {
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(w, r, db)
	})
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		handlers.Register(w, r, db)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../front/index.html")
	})

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("../front/static"))))

	// Route WebSocket corrigée avec `hub`
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnections(w, r)
	})
}
