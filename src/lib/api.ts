export async function fetchProjects() {
  const res = await fetch("/api/users/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function applyProject(data: FormData) {
  const res = await fetch("/api/users/projects", {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to apply project");
  return res.json();
}

export async function uploadMilestone(projectId: string, milestoneId: string, data: FormData) {
  const res = await fetch(`/api/users/projects/${projectId}/milestones`, {
    method: "POST",
    body: data
  });
  if (!res.ok) throw new Error("Failed to upload milestone");
  return res.json();
}

export async function saveWalletKey(walletKey: string) {
  const res = await fetch("/api/users/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletKey })
  });
  if (!res.ok) throw new Error("Failed to save wallet key");
  return res.json();
}
