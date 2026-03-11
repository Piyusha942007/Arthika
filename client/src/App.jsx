import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";

import Home from "./pages/Home/Home";
import Invest from "./pages/Invest/Invest";
import Save from "./pages/Invest/Save";
import InvestLearn from "./pages/Invest/InvestLearn";

import Learn from "./pages/Learn/Learn";
import Lesson from "./pages/Learn/Lesson";
import Community from "./pages/Community/Community";
import Profile from "./pages/Profile/Profile"; 

import Navbar from "./components/common/Navbar";
import Chatbot from "./components/Chatbot/Chatbot";

function Layout({ children }) {
  const location = useLocation();
  // We hide the global Navbar on these specific pages
  const hideNavbarPaths = ["/", "/login", "/signup", "/signup/continue", "/sso-callback"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
      {shouldShowNavbar && <Chatbot />}
    </>
  );
}

/* Protect private pages */
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  
  // Wait for Clerk to load before deciding to redirect
  if (!isLoaded) return null; 

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
      {/* Layout must be INSIDE BrowserRouter to use useLocation() */}
      <Layout>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/signup/continue" element={<PublicRoute><Signup isContinue={true} /></PublicRoute>} />
          <Route path="/sso-callback" element={<SsoCallback />} />

          {/* PRIVATE */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />

          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />

          <Route path="/learn/lesson/:id" element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          } />

          <Route path="/invest" element={
            <ProtectedRoute>
              <Invest />
            </ProtectedRoute>
          } />

          <Route path="/invest/save" element={
            <ProtectedRoute>
              <Save />
            </ProtectedRoute>
          } />

          <Route path="/invest/learn" element={
            <ProtectedRoute>
              <InvestLearn />
            </ProtectedRoute>
          } />

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