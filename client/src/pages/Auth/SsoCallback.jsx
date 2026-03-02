import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SsoCallback() {
  const clerk = useClerk();
  const nav = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await clerk.handleRedirectCallback({
          redirectUrl: "/home",
          signUpUrl: "/signup/continue",
          continueSignUpUrl: "/signup/continue",
          firstFactorUrl: "/login",
          secondFactorUrl: "/login",
        });
      } catch (err) {
        console.error("SSO Callback Error:", err);
        setError("Authentication failed: " + (err.message || JSON.stringify(err)));
      }
    };
    handleRedirect();
  }, [clerk]);

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h2>Loading authentication...</h2>
    </div>
  );
}