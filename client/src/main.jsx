import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);

/* Google translate restore */
const savedLang = localStorage.getItem("lang");
if (savedLang) {
  const interval = setInterval(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = savedLang;
      select.dispatchEvent(new Event("change"));
      clearInterval(interval);
    }
  }, 500);
}

console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);