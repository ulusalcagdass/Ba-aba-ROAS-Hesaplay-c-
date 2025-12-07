import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme-provider";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <I18nProvider>
            <App />
        </I18nProvider>
    </ThemeProvider>
);
