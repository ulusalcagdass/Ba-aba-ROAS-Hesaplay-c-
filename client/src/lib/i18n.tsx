import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, currencies, type Language, type Currency } from "./translations";

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    currency: Currency;
    setCurrency: (curr: Currency) => void;
    t: (key: keyof typeof translations.tr, params?: Record<string, string | number>) => string;
    formatCurrency: (value: number) => string;
    formatPercent: (value: number) => string;
    formatRoas: (value: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem("roas-calculator-language");
        return (saved as Language) || "tr";
    });

    const [currency, setCurrency] = useState<Currency>(() => {
        const saved = localStorage.getItem("roas-calculator-currency");
        return (saved as Currency) || "TRY";
    });

    useEffect(() => {
        localStorage.setItem("roas-calculator-language", language);
        document.documentElement.lang = language;
    }, [language]);

    useEffect(() => {
        localStorage.setItem("roas-calculator-currency", currency);
    }, [currency]);

    const t = (key: keyof typeof translations.tr, params?: Record<string, string | number>) => {
        let text = translations[language][key] || translations["tr"][key] || key;

        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                text = text.replace(`{${paramKey}}`, String(paramValue));
            });
        }

        return text;
    };

    const formatCurrency = (value: number) => {
        const { locale, symbol } = currencies[currency];
        // Custom formatting to handle different symbol placements if needed, 
        // but Intl.NumberFormat usually handles it well.
        // We force the symbol to be visible.
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatPercent = (value: number) => {
        // Turkish puts % at the beginning, English at the end.
        if (language === "tr") {
            return "%" + new Intl.NumberFormat("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        } else {
            return new Intl.NumberFormat("en-US", {
                style: "percent",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value / 100);
        }
    };

    const formatRoas = (value: number) => {
        return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            currency,
            setCurrency,
            t,
            formatCurrency,
            formatPercent,
            formatRoas
        }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
