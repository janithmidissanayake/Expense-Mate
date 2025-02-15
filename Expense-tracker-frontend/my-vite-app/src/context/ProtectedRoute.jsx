import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider"; // Adjust the path to where AuthProvider is located

const ProtectedRoute = () => {
  const { token } = useAuth();
  console.log("Current token:", token); // Debugging line


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};



export default ProtectedRoute;
