import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initServices } from "./lib/initServices";

// Kick off platform-service initialisation without blocking render
initServices().catch((err) => console.warn("[OmniGrid] initServices warning:", err));

createRoot(document.getElementById("root")!).render(<App />);
