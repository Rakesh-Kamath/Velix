import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("❌ Unauthorized or token expired");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Dashboard</h2>
      {error && <p>{error}</p>}
      {user ? (
        <>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        !error && <p>Loading profile...</p>
      )}
    </div>
  );
}
