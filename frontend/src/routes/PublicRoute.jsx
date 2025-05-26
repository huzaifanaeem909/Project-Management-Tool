import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/auth";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
