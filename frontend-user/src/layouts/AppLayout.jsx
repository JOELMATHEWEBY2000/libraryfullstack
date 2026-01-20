import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../context/authStore";

export default function AppLayout() {
  const location = useLocation();
  const { token } = useAuth();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && token && <Navbar />}
      <Outlet />
    </>
  );
}
