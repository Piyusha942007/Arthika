import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";
import Home from "./pages/Home/Home";

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
}

function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/signup/continue" element={<PublicRoute><Signup isContinue={true} /></PublicRoute>} />
        <Route path="/sso-callback" element={<SsoCallback />} />

        {/* PRIVATE */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}