import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import AuthPage from "./AuthPage";
import "./Signup.css";

export default function Signup({ isContinue = false }) {

  const { signUp, setActive, isLoaded } = useSignUp();
  const nav = useNavigate();

  const [method, setMethod] = useState("email");

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const [code, setCode] = useState("");
  const [verify, setVerify] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return null;

  // CREATE ACCOUNT
  const create = async e => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await signUp.create({
        username: form.username,
        password: form.password,
        emailAddress: method === "email" ? form.email : undefined,
        phoneNumber: method === "phone" ? form.phone : undefined
      });

      // send verification
      if (method === "email") {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
      } else {
        await signUp.preparePhoneNumberVerification({
          strategy: "phone_code"
        });
      }

      setVerify(true);
    }
    catch (e) {
      console.log(e);
      setErr(e.errors?.[0]?.message || "Signup failed");
    }

    setLoading(false);
  };

  // CONTINUE ACCOUNT FROM OAUTH
  const continueOAuth = async e => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await signUp.update({
        username: form.username
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        nav("/home");
      }
    } catch (e) {
      console.log(e);
      setErr(e.errors?.[0]?.message || "Failed to continue sign up");
    }
    setLoading(false);
  };


  // VERIFY CODE
  const verifyCode = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = method === "email"
        ? await signUp.attemptEmailAddressVerification({
          code: code.trim()
        })
        : await signUp.attemptPhoneNumberVerification({
          code: code.trim()
        });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        nav("/home");
      } else {
        setErr("Verification incomplete");
      }

    } catch (e) {
      console.log(e);
      setErr(e.errors?.[0]?.message || "Invalid code");
    }

    setLoading(false);
  };


  const google = async (e) => {
    e.preventDefault();
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/home`,
        continueSignUpUrl: `${window.location.origin}/signup/continue`
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
            Create account or <Link to="/login">Login</Link>
          </p>

          <div className="toggle">
            <button
              className={method === "email" ? "active" : ""}
              onClick={() => setMethod("email")}
            >
              Email
            </button>

            <button
              className={method === "phone" ? "active" : ""}
              onClick={() => setMethod("phone")}
            >
              Phone
            </button>
          </div>

          {isContinue ? (
            <form onSubmit={continueOAuth}>
              <p>Just one more step! Choose a username for your account.</p>
              <label>Username</label>
              <input
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
              <button className="btn" disabled={loading}>
                {loading ? "Saving..." : "Complete Sign Up"}
              </button>
            </form>
          ) : !verify ? (

            <form onSubmit={create}>

              <label>Username</label>
              <input
                required
                onChange={e => setForm({ ...form, username: e.target.value })}
              />

              {method === "email" ? (
                <>
                  <label>Email</label>
                  <input
                    required
                    type="email"
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <label>Phone (+countrycode)</label>
                  <input
                    required
                    placeholder="+919876543210"
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </>
              )}

              <label>Password</label>
              <input
                required
                type="password"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />

              <button className="btn" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>

            </form>

          ) : (
            <div className="verifyBox">

              <p>Enter verification code</p>

              <input
                placeholder="123456"
                onChange={e => setCode(e.target.value)}
              />

              <button className="btn" onClick={verifyCode} disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </button>

            </div>
          )}

          {!isContinue && (
            <>
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
            </>
          )}

          {err && <p className="err">{err}</p>}

        </div>
      }
    />
  );
}