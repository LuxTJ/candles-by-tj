import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./lib/cartContext";
import { AdminProvider } from "./lib/adminContext";
import { SettingsProvider } from "./lib/siteSettings";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AdminProvider>
    <SettingsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SettingsProvider>
  </AdminProvider>
);
