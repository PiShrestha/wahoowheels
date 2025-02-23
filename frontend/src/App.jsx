import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css"

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Rides from "./pages/Rides";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}


function AppContent() {
  const location = useLocation();
  const isFooterHidden = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomNavbar />

      {/* Main content */}
      <div className="flex-grow-1 content-area">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Conditionally rendered Footer */}
      {!isFooterHidden && <Footer />}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
