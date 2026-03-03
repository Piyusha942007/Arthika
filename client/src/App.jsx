import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SsoCallback from "./pages/Auth/SsoCallback";
import Home from "./pages/Home/Home";
import Learn from './pages/Learn/Learn';
import Lesson from "./pages/Learn/Lesson";
import Navbar from "./components/common/Navbar"; // Import the common Navbar

// Helper component to handle conditional rendering of Navbar
function Layout({ children }) {
  const location = useLocation();
  
  // Define paths where the Navbar SHOULD NOT appear
  const hideNavbarPaths = ["/", "/login", "/signup", "/signup/continue", "/sso-callback"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
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
      {/* We wrap everything in Layout so Navbar has access to useLocation() */}
      <Layout>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/signup/continue" element={<PublicRoute><Signup isContinue={true} /></PublicRoute>} />
          <Route path="/sso-callback" element={<SsoCallback />} />
          
          {/* SHARED/CONTENT */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/invest" element={<ProtectedRoute><div>Invest Page</div></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><div>Community Page</div></ProtectedRoute>} />
          <Route
            path="/learn/lesson/6"
            element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            }
          />

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
      </Layout>
    </BrowserRouter>
  );
}