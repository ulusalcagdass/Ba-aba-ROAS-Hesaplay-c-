export type Language = "tr" | "en";
export type Currency = "TRY" | "USD" | "EUR" | "GBP";

export const translations = {
    tr: {
        title: "Başabaş ROAS Hesaplayıcı",
        subtitle: "E-ticaret operasyonlarınız için net karlılık ve ROAS hedeflerinizi saniyeler içinde hesaplayın.",
        beta: "Beta",
        save: "Kaydet",
        history: "Geçmiş",
        cancel: "İptal",
        load: "Yükle",
        delete: "Sil",
        copy: "Kopyala",
        newProduct: "Yeni Ürün",
        productName: "Ürün Adı",
        productNamePlaceholder: "Ürün adı girin...",
        productInfo: "Ürün Bilgileri",
        fixedCosts: "Sabit Ücretler",
        calculatedValues: "Hesaplanan Değerler",

        // Inputs
        aov: "Ortalama Sipariş Değeri (AOV)",
        productCost: "Ürün Maliyeti (Tekil)",
        creditCardFeePercent: "Kredi Kartı Ücretleri",
        paymentProcessingFee: "Ödeme İşlem Ücreti",
        shippingCost: "Kargo Ücreti",
        fulfillmentCost: "Operasyon (Fulfillment) Maliyeti",

        // Outputs
        creditCardFee: "Kredi Kartı Ücreti",
        totalCost: "Toplam Maliyet",
        costPercentage: "Maliyet Yüzdesi",
        grossMargin: "Brüt Kar Marjı",
        expectedProfit: "Beklenen Brüt Kar",
        breakEvenRoas: "Başabaş ROAS",
        marginRoas: "Marj ROAS",

        // Dialogs
        saveDialogTitle: "Hesaplamayı Kaydet",
        saveDialogDesc: "Bu hesaplamayı daha sonra tekrar kullanmak için kaydedin.",
        historyDialogTitle: "Kaydedilmiş Hesaplamalar",
        historyDialogDesc: "Daha önce kaydettiğiniz hesaplamaları yükleyin veya silin.",
        nameLabel: "İsim",
        namePlaceholder: "Örn: Yaz Sezonu Ürünleri",
        noSavedCalculations: "Henüz kaydedilmiş hesaplama yok.",
        savePrompt: "Hesaplamalarınızı kaydetmek için \"Kaydet\" butonunu kullanın.",

        // Warnings & Info
        lossWarningTitle: "Bu ürün şu an zarar ediyor!",
        lossWarningDesc: "Maliyetleriniz satış fiyatından yüksek. Lütfen fiyatı artırın veya maliyetleri düşürün.",
        maxMarginInfo: "Bu ürün maliyetleriyle ulaşabileceğiniz maksimum brüt kar marjı {margin} seviyesindedir.",
        maxMarginHint: "Daha yüksek marj hedefleri için maliyetleri düşürmeniz veya fiyatı artırmanız gerekir.",

        // Comparison
        comparisonTab: "Karşılaştır",
        comparisonTitle: "Ürün Karşılaştırması",
        comparisonEmpty: "Karşılaştırma için en az 2 ürün ekleyin",
        metric: "Metrik",

        // Charts
        roasChartTitle: "ROAS Hedefleri Karşılaştırması",
        marginChartTitle: "Kar Marjı vs Maliyet",

        // Toasts
        errorTitle: "Hata",
        errorNameRequired: "Lütfen hesaplama için bir isim girin.",
        successSaved: "Hesaplama kaydedildi",
        successSavedDesc: "Hesaplamanız tarayıcı hafızasına kaydedildi.",
        successDeleted: "Hesaplama silindi",
        successDeletedDesc: "Hesaplama başarıyla silindi.",
        successLoaded: "Hesaplama yüklendi",
        successLoadedDesc: "\"{name}\" hesaplaması yüklendi.",

        // Footer
        footerText: "Performans Pazarlama için Başabaş ROAS Hesaplayıcı",
    },
    en: {
        title: "Break-Even ROAS Calculator",
        subtitle: "Calculate your net profitability and ROAS targets for your e-commerce operations in seconds.",
        beta: "Beta",
        save: "Save",
        history: "History",
        cancel: "Cancel",
        load: "Load",
        delete: "Delete",
        copy: "Copy",
        newProduct: "New Product",
        productName: "Product Name",
        productNamePlaceholder: "Enter product name...",
        productInfo: "Product Information",
        fixedCosts: "Fixed Costs",
        calculatedValues: "Calculated Values",

        // Inputs
        aov: "Average Order Value (AOV)",
        productCost: "Product Cost (Unit)",
        creditCardFeePercent: "Credit Card Fees",
        paymentProcessingFee: "Payment Processing Fee",
        shippingCost: "Shipping Cost",
        fulfillmentCost: "Fulfillment Cost",

        // Outputs
        creditCardFee: "Credit Card Fee",
        totalCost: "Total Cost",
        costPercentage: "Cost Percentage",
        grossMargin: "Gross Margin",
        expectedProfit: "Expected Gross Profit",
        breakEvenRoas: "Break-Even ROAS",
        marginRoas: "Margin ROAS",

        // Dialogs
        saveDialogTitle: "Save Calculation",
        saveDialogDesc: "Save this calculation to use it again later.",
        historyDialogTitle: "Saved Calculations",
        historyDialogDesc: "Load or delete your previously saved calculations.",
        nameLabel: "Name",
        namePlaceholder: "Ex: Summer Season Products",
        noSavedCalculations: "No saved calculations yet.",
        savePrompt: "Use the \"Save\" button to save your calculations.",

        // Warnings & Info
        lossWarningTitle: "This product is currently losing money!",
        lossWarningDesc: "Your costs are higher than the selling price. Please increase the price or reduce costs.",
        maxMarginInfo: "With these product costs, the maximum gross margin you can achieve is {margin}.",
        maxMarginHint: "For higher margin targets, you need to reduce costs or increase the price.",

        // Comparison
        comparisonTab: "Compare",
        comparisonTitle: "Product Comparison",
        comparisonEmpty: "Add at least 2 products to compare",
        metric: "Metric",

        // Charts
        roasChartTitle: "ROAS Targets Comparison",
        marginChartTitle: "Gross Margin vs Cost",

        // Toasts
        errorTitle: "Error",
        errorNameRequired: "Please enter a name for the calculation.",
        successSaved: "Calculation saved",
        successSavedDesc: "Your calculation has been saved to browser storage.",
        successDeleted: "Calculation deleted",
        successDeletedDesc: "Calculation successfully deleted.",
        successLoaded: "Calculation loaded",
        successLoadedDesc: "\"{name}\" calculation loaded.",

        // Footer
        footerText: "Break-Even ROAS Calculator for Performance Marketing",
    }
};

export const currencies = {
    TRY: { symbol: "₺", locale: "tr-TR" },
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
};
