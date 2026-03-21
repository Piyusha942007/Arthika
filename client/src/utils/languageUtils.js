const supportedLanguages = [
    { code: "en-IN", name: "English", googCode: "en" },
    { code: "hi-IN", name: "हिंदी (Hindi)", googCode: "hi" },
    { code: "mr-IN", name: "मराठी (Marathi)", googCode: "mr" },
    { code: "gu-IN", name: "ગુજરાતી (Gujarati)", googCode: "gu" },
    { code: "bn-IN", name: "বাংলা (Bengali)", googCode: "bn" },
    { code: "te-IN", name: "తెలుగు (Telugu)", googCode: "te" },
    { code: "ta-IN", name: "தமிழ் (Tamil)", googCode: "ta" },
    { code: "ur-IN", name: "اردو (Urdu)", googCode: "ur" },
    { code: "ml-IN", name: "മലയാളം (Malayalam)", googCode: "ml" }
];

export const getCodeFromGoog = (shortCode) => {
    const match = supportedLanguages.find(l => l.googCode === shortCode);
    return match ? match.code : "en-IN";
};

export const getInitialLang = () => {
    // 1. Check Google Translate combo box
    const select = document.querySelector(".goog-te-combo");
    if (select && select.value) {
        return getCodeFromGoog(select.value);
    }
    
    // 2. Check Google Translate cookie (googtrans)
    const match = document.cookie.match(/googtrans=\/en\/(.*?)(;|$)/);
    if (match && match[1]) {
        return getCodeFromGoog(match[1]);
    }
    
    // 3. Check LocalStorage (for app-specific stickiness)
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
        return storedLang.includes('-') ? storedLang : `${storedLang}-IN`;
    }
    
    return "en-IN"; // Default
};

export const getLanguageName = (code) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? lang.name : "English";
};

export { supportedLanguages };
