import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";

import Home from "./pages/Home/Home";
import Invest from "./pages/Invest/Invest";
import Save from "./pages/Invest/Save";
import InvestLearn from "./pages/Invest/InvestLearn";

/* Protect private pages - used ONLY for Profile/Settings later */
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

/* Prevent logged-in users from auth pages */
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
        {/* --- PUBLIC ROUTES --- */}
        {/* These pages will now load INSTANTLY without Clerk blocking them */}
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/invest/save" element={<Save />} />
        <Route path="/invest/learn" element={<InvestLearn />} />

        {/* --- AUTH ROUTES --- */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/signup/continue" element={<PublicRoute><Signup isContinue={true} /></PublicRoute>} />
        <Route path="/sso-callback" element={<SsoCallback />} />

        {/* --- PRIVATE ROUTES --- */}
        {/* You can add your Profile page here later when you need Clerk again */}
        {/* <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }/> 
        */}

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}