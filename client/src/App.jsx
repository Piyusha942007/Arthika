import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";
import Home from "./pages/Home/Home";
import Community from "./pages/Community/Community";
import Navbar from "./components/common/Navbar";
import Chatbot from "./components/Chatbot/Chatbot";

import Learn from "./pages/Learn/Learn";
import Lesson from "./pages/Learn/Lesson";
import Invest from "./pages/Invest/Invest";
import InvestLearn from "./pages/Invest/InvestLearn";
import Save from "./pages/Invest/Save";
import Profile from "./pages/Profile/Profile";
import Quiz from "./pages/Quiz/Quiz";
import Dashboard from "./pages/Dashboard/Dashboard";

// Helper component to handle conditional rendering of Navbar
function Layout({ children }) {
  const location = useLocation();

  // Define paths where the Navbar SHOULD NOT appear
  const hideNavbarPaths = ["/", "/login", "/signup", "/signup/continue", "/sso-callback"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  // Define paths where the Chatbot SHOULD NOT appear
  const hideChatbotPaths = ["/community"];
  const shouldShowChatbot = shouldShowNavbar && !hideChatbotPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
      {shouldShowChatbot && <Chatbot />}
    </>
  );
}

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
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/learn/lesson/:id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
          <Route path="/invest" element={<ProtectedRoute><Invest /></ProtectedRoute>} />
          <Route path="/invest/learn" element={<ProtectedRoute><InvestLearn /></ProtectedRoute>} />
          <Route path="/invest/save" element={<ProtectedRoute><Save /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}