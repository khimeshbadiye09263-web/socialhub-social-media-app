import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>

);