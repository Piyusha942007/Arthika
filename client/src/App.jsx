import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile"; 
import Navbar from "./components/common/Navbar";

function Layout({ children }) {
  const location = useLocation();
  // We hide the global Navbar on these specific pages
  const hideNavbarPaths = ["/", "/login", "/signup", "/signup/continue", "/sso-callback", "/profile"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  
  // Wait for Clerk to load before deciding to redirect
  if (!isLoaded) return null; 

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
      <Layout>
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
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}