import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import AuthPage from "./AuthPage";
import "./Login.css";

export default function Login() {

  const { signIn, setActive, isLoaded } = useSignIn();
  const nav = useNavigate();

  const [method, setMethod] = useState("email");
  const [form, setForm] = useState({ identifier: "piyushaamrutkar41@gmail.com", password: "" });
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [err, setErr] = useState("");

  const [loading, setLoading] = useState(false);

  if (!isLoaded) return null;

  const submit = async e => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await signIn.create({
        identifier: form.identifier,
        password: form.password
      });

      console.log("SignIn Response:", res);

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        nav("/home");
      } else if (res.status === "needs_second_factor") {
        // Log what factor it's asking for to debug
        console.warn("Required 2FA factors:", res.supportedSecondFactors);
        setErr("This specific account is stuck asking for 2FA. Please delete this test account and create a new one, or use Google Login.");
      } else if (res.status === "needs_first_factor") {
        setErr("Incorrect password or invalid login method.");
      } else {
        console.warn("Unhandled SignIn Status:", res.status);
        setErr(`Unhandled login state: ${res.status}`);
      }

    } catch (e) {
      console.error("Login Error:", e);
      setErr(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const phoneLogin = async () => {
    try {
      await signIn.create({
        identifier: form.identifier
      });

      await signIn.prepareFirstFactor({
        strategy: "phone_code"
      });

      setVerifying(true);

    } catch (e) {
      setErr(e.errors?.[0]?.message);
    }
  };

  const verifyCode = async () => {
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        nav("/home");
      }

    } catch (e) {
      setErr("Invalid code");
    }
  };

  const google = async (e) => {
    e.preventDefault();
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/home`
      });
    } catch (error) {
      console.error("OAuth Error:", error);
      setErr(error.errors?.[0]?.message || error.message || "Google auth failed.");
    }
  };

  return (
    <AuthPage
      right={
        <div>

          <h1 className="title">Welcome!</h1>

          <p className="switch">
            Login or <Link to="/signup">Create account</Link>
          </p>

          <div className="toggle">
            <button onClick={() => setMethod("email")}>Email</button>
            <button onClick={() => setMethod("phone")}>Phone</button>
          </div>

          {!verifying ? (
            <form onSubmit={submit}>

              <label>{method === "email" ? "Email" : "Phone"}</label>
              <input
                value={form.identifier}
                onChange={e => setForm({ ...form, identifier: e.target.value })}
              />

              {method === "email" && <>
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </>}

              {method === "email"
                ? <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                : <button type="button" onClick={phoneLogin} className="btn" disabled={loading}>Send Code</button>
              }

            </form>
          ) : (
            <div>
              <input
                placeholder="Enter code"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <button onClick={verifyCode} className="btn">Verify</button>
            </div>
          )}

          <div className="divider">OR</div>

          <button type="button" className="btn dark" onClick={google} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {err && <p className="err">{err}</p>}

        </div>
      }
    />
  );
}