package main

import (
	"database/sql"
	"log"
	"net/http"
	"real-time-forum/routes"

	_ "github.com/mattn/go-sqlite3"
)

// Middleware CORS
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Configuration des en-têtes CORS
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // Pour les requêtes OPTIONS, on répond sans exécuter le handler suivant
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Appel au prochain middleware ou handler
        next.ServeHTTP(w, r)
    })
}

func main() {
    db, err := sql.Open("sqlite3", "./database/real-time-forum.db")
    if err != nil {
        log.Fatalf("Erreur de connexion à la base de données : %v", err)
    }
    defer db.Close()

    mux := http.NewServeMux()
    routes.SetupRoutes(mux, db) // On passe `db`

    // Ajout du middleware CORS
    handlerWithCORS := corsMiddleware(mux)

    log.Println("Serveur démarré sur le port 8080")
    log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}