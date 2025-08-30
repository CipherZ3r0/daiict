"use client";
import { useState } from "react";

export default function AuditorDashboard() {
  const [milestones, setMilestones] = useState([
    { id: 1, project: "Hydrogen Plant", doc: "milestone1.pdf", status: "Pending" },
    { id: 2, project: "Solar Electrolyzer", doc: "report.png", status: "Pending" },
  ]);

  const handleReview = (id: number, newStatus: string) => {
    setMilestones((m) =>
      m.map((ms) => (ms.id === id ? { ...ms, status: newStatus } : ms))
    );
  };

  return (
    <main style={{ padding: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "purple" }}>
        Auditor Dashboard
      </h1>

      <h2 style={{ marginTop: "20px", fontSize: "1.25rem" }}>Pending Milestones</h2>
      <ul>
        {milestones.map((m) => (
          <li key={m.id} style={{ margin: "10px 0" }}>
            {m.project} – <a href="#">{m.doc}</a> → <b>{m.status}</b>
            {m.status === "Pending" && (
              <>
                <button
                  onClick={() => handleReview(m.id, "Approved")}
                  style={{ marginLeft: "10px" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview(m.id, "Rejected")}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
