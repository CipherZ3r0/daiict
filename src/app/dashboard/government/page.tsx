"use client";
import { useState } from "react";

export default function GovernmentDashboard() {
  const [applications, setApplications] = useState([
    { id: 1, producer: "Company A", project: "Hydrogen Plant", status: "Pending" },
    { id: 2, producer: "Company B", project: "Solar Electrolyzer", status: "Approved" },
  ]);

  const handleAction = (id: number, newStatus: string) => {
    setApplications((apps) =>
      apps.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <main style={{ padding: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "blue" }}>
        Government Dashboard
      </h1>

      <h2 style={{ marginTop: "20px", fontSize: "1.25rem" }}>Applications</h2>
      <ul>
        {applications.map((a) => (
          <li key={a.id} style={{ margin: "10px 0" }}>
            {a.producer} – {a.project} → <b>{a.status}</b>
            {a.status === "Pending" && (
              <>
                <button
                  onClick={() => handleAction(a.id, "Approved")}
                  style={{ marginLeft: "10px" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(a.id, "Rejected")}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </>
            )}
            {a.status === "Approved" && (
              <button
                onClick={() => alert("Milestone created (dummy)!")}
                style={{ marginLeft: "10px" }}
              >
                Create Milestone
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
