import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isLoaded) return null;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid verification code");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleVerify}>
        <h2>Verify Email</h2>

        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Verify</button>
      </form>
    </div>
  );
}