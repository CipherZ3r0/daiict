"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("PRODUCER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard based on role
        router.push(`/dashboard/${role.toLowerCase()}`);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Green Hydrogen Platform</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        className="border p-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="PRODUCER">Producer</option>
        <option value="GOVERNMENT">Government</option>
        <option value="AUDITOR">Auditor</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
