package routes

import (
	"database/sql"
	"net/http"
	"real-time-forum/handlers"
	"real-time-forum/websocketFile" // Import du package WebSocket
)

// Ajout de `hub *websocketFile.Hub` en paramètre
func SetupRoutes(mux *http.ServeMux, db *sql.DB, hub *websocketFile.Hub) {
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(w, r, db)
	})
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		handlers.Register(w, r, db)
	})

	mux.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
		handlers.Post(w, r, db)
	})

	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		handlers.Logout(db, w, r)
	})

	mux.HandleFunc("/message", func(w http.ResponseWriter, r *http.Request) {
		handlers.PrivateMessage(db, w, r)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../front/index.html")
	})

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("../front/static"))))

	// Route WebSocket corrigée avec `hub`
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnections(db, w, r)
	})
}
