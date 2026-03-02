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
      left={<LeftPanel />}
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

              <button type="button" className="btn dark" onClick={google}>
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



function LeftPanel() {
  return (
    <>
      <img src="/image.png" className="art" />
      <h1 className="brand">Arthika</h1>
      <p className="tag">Aapka Paisa, Aapka Faisla</p>
      <p className="desc">
        A multilingual financial empowerment platform designed to make money management easy, accessible, and secure.
      </p>
    </>
  );
}