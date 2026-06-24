import { createContext, useContext, useState, useEffect } from "react";
import { products as defaultProducts, type Product } from "./products";

export type SiteSettings = {
  accentColor: string;
  heroImage: string;
  footerText: string;
  meetTheMakerImage: string;
  goodToKnowImage: string;
  products: Product[];
};

const defaults: SiteSettings = {
  accentColor: "#e8a0b0",
  heroImage: "/images/banner.png",
  footerText: "Candles by TJ",
  meetTheMakerImage: "/images/meet-the-maker.jpg",
  goodToKnowImage: "/images/good-to-know.jpg",
  products: defaultProducts,
};

type SettingsContextType = {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  resetSettings: () => void;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults,
  updateSettings: async () => {},
  updateProduct: async () => {},
  resetSettings: () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()).catch(() => ({})),
      fetch("/api/products").then((r) => r.json()).catch(() => defaultProducts),
    ]).then(([rawSettings, products]) => {
      setSettings({
        accentColor: rawSettings.accentColor ?? defaults.accentColor,
        heroImage: rawSettings.heroImage ?? defaults.heroImage,
        footerText: rawSettings.footerText ?? defaults.footerText,
        meetTheMakerImage: rawSettings.meetTheMakerImage ?? defaults.meetTheMakerImage,
        goodToKnowImage: rawSettings.goodToKnowImage ?? defaults.goodToKnowImage,
        products: Array.isArray(products) && products.length > 0 ? products : defaultProducts,
      });
    }).finally(() => setLoading(false));
  }, []);

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    const { accentColor, heroImage, footerText, meetTheMakerImage, goodToKnowImage } = next;
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accentColor, heroImage, footerText, meetTheMakerImage, goodToKnowImage }),
    }).catch(() => null);
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    const product = settings.products.find((p) => p.id === id);
    if (!product) return;
    const updated = { ...product, ...updates };
    setSettings((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? updated : p)),
    }));
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: updated.name, price: updated.price, dimensions: updated.dimensions, weight: updated.weight }),
    }).catch(() => null);
  };

  const resetSettings = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accentColor: defaults.accentColor,
        heroImage: defaults.heroImage,
        footerText: defaults.footerText,
        meetTheMakerImage: defaults.meetTheMakerImage,
        goodToKnowImage: defaults.goodToKnowImage,
      }),
    }).catch(() => null);
    setSettings(defaults);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateProduct, resetSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
