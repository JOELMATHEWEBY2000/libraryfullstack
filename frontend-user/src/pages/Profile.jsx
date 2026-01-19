import { useEffect, useState } from "react";
import { getProfile, addProfile, updateProfile } from "../api/profileApi";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000";

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    profile_picture: null,
  });

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      if (res.data) {
        setProfile(res.data);
        setForm({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          profile_picture: null, // reset file input
        });
      }
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    if (form.profile_picture) {
      formData.append("profile_picture", form.profile_picture);
    }

    try {
      if (profile) {
        await updateProfile(formData);
      } else {
        await addProfile(formData);
      }

      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error("Profile save failed", err);
    }
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your profile? This action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    await deleteProfile();
    setProfile(null);
    setEditMode(false);
    alert("Profile deleted successfully");
  } catch (err) {
    console.error("Profile delete failed", err);
    alert("Failed to delete profile");
  }
};


  if (loading) return <p>Loading...</p>;

  /* ================= VIEW MODE ================= */

  if (profile && !editMode) {
    return (
      <div className="profile-card">
        <h2>My Profile</h2>

        {profile.profile_picture ? (
          <img
          src={`${BACKEND_URL}${profile.profile_picture}`}
          alt="Profile"
          className="profile-avatar"
        />
        ) : (
          <div className="profile-avatar placeholder">
            No Image
          </div>
        )}

        <p><strong>Name:</strong> {profile.fullname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>

        <button onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      <button
      className="delete-btn"
      onClick={handleDelete}
    >
      Delete Profile
    </button>
      </div>
    );
  }

  /* ================= ADD / EDIT FORM ================= */

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>{profile ? "Edit Profile" : "Add Profile"}</h2>

      <input
        name="fullname"
        placeholder="Full Name"
        value={form.fullname}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <input
        name="profile_picture"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <button type="submit">
        {profile ? "Update Profile" : "Add Profile"}
      </button>

      {profile && (
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
