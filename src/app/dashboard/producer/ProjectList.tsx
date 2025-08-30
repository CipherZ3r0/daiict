"use client";

import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  status: string;
  submittedAt: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch projects from API
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">All Projects</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id} className="text-center border-t">
              <td>{p.name}</td>
              <td>{p.status}</td>
              <td>{new Date(p.submittedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
