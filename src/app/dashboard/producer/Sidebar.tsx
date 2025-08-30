"use client";

interface SidebarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  return (
    <div className="w-60 bg-gray-100 p-4 flex flex-col space-y-4">
      <button
        className={selectedTab === "projects" ? "font-bold" : ""}
        onClick={() => setSelectedTab("projects")}
      >
        Projects
      </button>
      <button
        className={selectedTab === "apply" ? "font-bold" : ""}
        onClick={() => setSelectedTab("apply")}
      >
        Apply Subsidy
      </button>
      <button
        className={selectedTab === "milestones" ? "font-bold" : ""}
        onClick={() => setSelectedTab("milestones")}
      >
        Milestones
      </button>
      <button
        className={selectedTab === "wallet" ? "font-bold" : ""}
        onClick={() => setSelectedTab("wallet")}
      >
        Wallet
      </button>
    </div>
  );
}
