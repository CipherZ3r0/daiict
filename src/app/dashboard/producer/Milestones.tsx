"use client";

import { useState } from "react";

export default function Milestones() {
  const [projectId, setProjectId] = useState("");
  const [milestoneName, setMilestoneName] = useState("");
  const [docs, setDocs] = useState<FileList | null>(null);

  const handleAddMilestone = async () => {
    if (!projectId || !milestoneName) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("milestoneName", milestoneName);
    if (docs) Array.from(docs).forEach((file) => formData.append("docs", file));

    const res = await fetch(`/api/projects/${projectId}/milestone`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) alert("Milestone added!");
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Milestone Name"
        value={milestoneName}
        onChange={(e) => setMilestoneName(e.target.value)}
        className="border p-2"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setDocs(e.target.files)}
        className="border p-2"
      />
      <button
        onClick={handleAddMilestone}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Milestone
      </button>
    </div>
  );
}
