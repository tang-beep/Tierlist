import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LanguageProvider } from "./context/LanguageContext.tsx";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </DndProvider>
    </BrowserRouter>
  </StrictMode>
);
