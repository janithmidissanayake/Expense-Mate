// src/context/AuthProvider.jsx
import  { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("site", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("site");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const loginAction = async (credentials) => {
    try {
      localStorage.removeItem("site"); // Clear old token before logging in
      const response = await axios.post("http://localhost:8080/api/v1/auth/authenticate", credentials);
      console.log("Login successful:", response.data);
  
      if (response.data.access_token) {
        const newToken = response.data.access_token;
  
        // Store the token in localStorage
        localStorage.setItem("site", newToken);
  
        // Update the token in state
        setToken(newToken);
  
        // Set the Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  
        const userResponse = await axios.get("http://localhost:8080/api/v1/user/me");
        console.log("User data:", userResponse.data);
        setUser(userResponse.data);  // Make sure this sets user correctly
  
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: "No access token received" };
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data.message || error.message);
      return { success: false, message: error.response?.data.message || "Login failed" };
    }
  };
  
  

  const logOut = async (navigate) => {
    try {
      // Send POST request to logout endpoint
      await axios.post("http://localhost:8080/api/v1/auth/logout");
  
      // Clear authentication data
      setUser(null);
      setToken("");
      localStorage.removeItem("site");
      delete axios.defaults.headers.common["Authorization"];
  
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data.message || error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, token, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
