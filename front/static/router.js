import { login} from "./login-page/login.js";
import {home} from "./home-page/home.js";

export const router = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
        home()
    };

    socket.onerror = (error) => {
        login(); // Appelle login() si erreur
    };

    socket.onclose = (event) => {
        login(); // Appelle login() si déconnexion
    };
};