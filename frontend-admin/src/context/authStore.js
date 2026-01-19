import { create } from "zustand";
import authApi from "../api/authApi";

// Restore from storage
const token = localStorage.getItem("access");
const storedUser = localStorage.getItem("user");

const useAuth = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: token,
  loading: false,

  // --------------------
  // LOGIN
  // --------------------
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login({ email, password });
      const { access, refresh, user } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token: access, user });
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // --------------------
  // LOAD USER (OPTIONAL)
  // --------------------
  loadUser: async () => {
    try {
      const res = await authApi.profile();
      set({ user: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      localStorage.clear();
      set({ user: null, token: null });
    }
  },

  // --------------------
  // LOGOUT
  // --------------------
  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
    window.location.href = "/login";
  },
}));

export default useAuth;
