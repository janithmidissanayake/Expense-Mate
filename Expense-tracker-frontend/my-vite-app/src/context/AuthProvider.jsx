// src/context/AuthProvider.jsx
import  { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("site", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("site");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Interceptor to handle token refresh
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
        (response) => response, // if response is successful, return it
        async (error) => {
          if (error.response.status === 401) { // Token expired or unauthorized
            const originalRequest = error.config;

            if (!refreshToken) {
              // If we don't have a refresh token, the user needs to log in again
              return Promise.reject(error);
            }

            try {
              const refreshResponse = await axios.post(`/api/v1/auth/refresh-token`, {
                refresh_token: refreshToken,
              });

              // Store the new tokens
              const newAccessToken = refreshResponse.data.access_token;
              const newRefreshToken = refreshResponse.data.refresh_token;

              localStorage.setItem("site", newAccessToken);
              localStorage.setItem("refresh_token", newRefreshToken);

              setToken(newAccessToken);
              setRefreshToken(newRefreshToken);

              // Retry the original request with the new access token
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);

            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              return Promise.reject(refreshError); // If refresh fails, reject the original request
            }
          }
          return Promise.reject(error); // Reject other errors
        }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken]);

  const loginAction = async (credentials) => {
    try {
      localStorage.removeItem("site"); // Clear old token before logging in
      const response = await axios.post(`/api/v1/auth/authenticate`, credentials);
      console.log("Login successful:", response.data);
  
      if (response.data.access_token) {
        const newToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;


        // Store the token in localStorage
        localStorage.setItem("site", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);


        // Update the token in state
        setToken(newToken);
        setRefreshToken(newRefreshToken);


        // Set the Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        const userResponse = await axios.get(`/api/v1/user/me`);
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
      await axios.post(`/api/v1/auth/logout`);
  
      // Clear authentication data
      setUser(null);
      setToken("");
      setRefreshToken("");

      localStorage.removeItem("site");
      localStorage.removeItem("refresh_token");

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
