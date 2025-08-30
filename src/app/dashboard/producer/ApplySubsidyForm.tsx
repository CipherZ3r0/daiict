"use client";

import { useState } from "react";

export default function ApplySubsidyForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [docs, setDocs] = useState<FileList | null>(null);

  const handleSubmit = async () => {
    if (!name || !description) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (docs) {
      Array.from(docs).forEach((file) => formData.append("docs", file));
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) alert("Project submitted!");
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />
      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setDocs(e.target.files)}
        className="border p-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
