import { useState } from "react";
import useAuth from "../context/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const login = useAuth((state) => state.login);
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      nav("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={submit} style={styles.form}>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={styles.input}
      />

      <button style={styles.btn}>Login</button>
    </form>
  );
}

const styles = {
  form: { maxWidth: "400px", margin: "30px auto" },
  input: { width: "100%", padding: "10px", marginBottom: "10px" },
  btn: { width: "100%", padding: "10px", background: "#1e40af", color: "white" },
};
