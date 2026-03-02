import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import AuthPage from "./AuthPage";
import "./Login.css";

export default function Login() {

  const { signIn, setActive, isLoaded } = useSignIn();
  const nav = useNavigate();

  const [method, setMethod] = useState("email");
  const [form, setForm] = useState({ identifier: "", password: "" });
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
      left={<LeftPanel />}
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

          <button type="button" className="btn dark" onClick={google}>
            Continue with Google
          </button>

          {err && <p className="err">{err}</p>}

        </div>
      }
    />
  );
}

function LeftPanel() {
  return (
    <>
      <img src="../../assets/images/hero.png" alt="" className="art" />
      <h1 className="brand">Arthika</h1>
      <p className="tag">Aapka Paisa, Aapka Faisla</p>
      <p className="desc">
        A multilingual financial empowerment platform designed to make money management easy, accessible, and secure.
      </p>
    </>
  );
}