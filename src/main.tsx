import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TeamProvider } from "./context/team-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TeamProvider>
      <App />
    </TeamProvider>
  </StrictMode>
);
