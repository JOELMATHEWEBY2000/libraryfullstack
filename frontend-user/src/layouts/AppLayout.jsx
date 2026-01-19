import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../context/authStore";

export default function AppLayout({ children }) {
  const location = useLocation();
  const { token } = useAuth();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && token && <Navbar />}
      {children}
    </>
  );
}
