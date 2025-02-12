package routes

import (
	"database/sql"
	"net/http"
	"real-time-forum/handlers"
)

func SetupRoutes(mux *http.ServeMux, db *sql.DB) {
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(w, r, db)
	})
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		handlers.Register(w, r, db)
	})
}
