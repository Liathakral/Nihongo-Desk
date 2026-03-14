import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RouteProvider } from "./providers/router-provider";
import { ThemeProvider } from "./providers/theme-provider";
import "./index.css";
import { LogsProvider } from "./context/LogsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteProvider>
        <ThemeProvider>
          <LogsProvider>
            <App />
          </LogsProvider>
        </ThemeProvider>
      </RouteProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
