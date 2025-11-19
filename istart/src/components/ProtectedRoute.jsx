import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First check localStorage
      const localAuth = localStorage.getItem("isAuthenticated");
      
      if (!localAuth) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify with server
      const response = await fetch("http://localhost:8000/api/check-auth.php", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.authenticated) {
        setIsAuthenticated(true);
        // Update localStorage with latest user data
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setIsAuthenticated(false);
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/Login" />;
};

export default ProtectedRoute;