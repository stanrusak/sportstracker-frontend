import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./utils/auth.tsx";
import { WorkoutContextProvider } from "./context/workouts.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkoutContextProvider>
        <App />
      </WorkoutContextProvider>
    </AuthProvider>
  </React.StrictMode>,
);
