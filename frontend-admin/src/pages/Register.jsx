import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";



export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    role: "admin",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await authApi.register(form);
      alert("Registered successfully!");
      nav("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data);

      if (err.response?.data) {
        const errors = err.response.data;
        let message = "Registration failed:\n\n";

        for (const field in errors) {
          message += `${field}: ${errors[field].join(", ")}\n`;
        }

        alert(message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={submit} style={styles.form}>
      <h2>Admin Register</h2>

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
        required
        style={styles.input}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        required
        style={styles.input}
      />

      <input
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) =>
          setForm({ ...form, full_name: e.target.value })
        }
        required
        style={styles.input}
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        required
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
        style={styles.input}
      />

      <button type="submit" style={styles.btn}>
        Register
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    background: "#111",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
