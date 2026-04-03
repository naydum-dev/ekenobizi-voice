import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import About from "./pages/About";
import PostPage from "./pages/PostPage";

// Placeholder for pages we haven't built yet
const ComingSoon = ({ page }) => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="text-center">
      <h2
        className="text-3xl font-bold text-charcoal mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {page}
      </h2>
      <p className="text-gray-500">Coming soon — check back on Day 4!</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<ComingSoon page="Stories" />} />
            <Route
              path="/community"
              element={<ComingSoon page="Community" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
