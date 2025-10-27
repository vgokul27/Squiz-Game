import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userSlice";

const useAuth = () => {
  const { isAuthenticated, user, logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token && isAuthenticated) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  return { isAuthenticated, user, logout };
};

export default useAuth;
