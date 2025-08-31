"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Wallet,
  Search,
  Plus,
  Eye,
  TrendingUp
} from "lucide-react";

// Replace with your actual API calls
async function fetchSubsidies() {
  const res = await fetch("/api/government/subsidies");
  return res.json();
}
async function updateSubsidyStatus(id: string, action: string) {
  const res = await fetch(`/api/government/subsidies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}
async function fetchProducers() {
  const res = await fetch("/api/government/producers");
  return res.json();
}
async function verifyWallet(producerId: string, verified: boolean) {
  const res = await fetch(`/api/government/wallet/${producerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verified }),
  });
  return res.json();
}
async function fetchReports() {
  const res = await fetch("/api/government/reports");
  return res.json();
}
async function connectCryptoWallet(walletAddress: string) {
  const res = await fetch("/api/government/crypto-wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return res.json();
}

export default function GovernmentDashboard() {
  const [tab, setTab] = useState<"overview" | "subsidies" | "producers" | "wallet" | "reports">("overview");

  // States
  const [stats, setStats] = useState<any>({});
  const [subsidies, setSubsidies] = useState<any[]>([]);
  const [producers, setProducers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [subs, prods, reps] = await Promise.all([fetchSubsidies(), fetchProducers(), fetchReports()]);
      setSubsidies(subs);
      setProducers(prods);
      setReports(reps);
      setStats({
        total: subs.length,
        pending: subs.filter((s: any) => s.status === "PENDING").length,
        approved: subs.filter((s: any) => s.status === "APPROVED").length,
        rejected: subs.filter((s: any) => s.status === "REJECTED").length,
        terminated: subs.filter((s: any) => s.status === "TERMINATED").length,
        disbursed: subs.filter((s: any) => s.status === "APPROVED").reduce((acc: number, s: any) => acc + s.amount, 0),
      });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubsidyAction = async (id: string, action: string) => {
    const updated = await updateSubsidyStatus(id, action);
    setSubsidies(prev => prev.map(s => (s._id === id ? updated : s)));
  };

  const handleWalletVerify = async (id: string, verified: boolean) => {
    const updated = await verifyWallet(id, verified);
    setProducers(prev => prev.map(p => (p._id === id ? updated : p)));
  };

  const handleConnectWallet = async () => {
    if (!walletAddress.trim()) return;
    
    setIsConnectingWallet(true);
    try {
      await connectCryptoWallet(walletAddress);
      setWalletAddress("");
      // Show success message or update UI
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Filter producers by search
  const filteredProducers = producers.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "TERMINATED":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><AlertTriangle className="w-3 h-3 mr-1" />Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: any; icon: any; trend?: string }) => (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-green-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-green-800">{typeof value === 'number' && title.toLowerCase().includes('disbursed') ? `$${value.toLocaleString()}` : value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className="p-3 bg-green-200 rounded-full">
          <Icon className="w-6 h-6 text-green-700" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Government Dashboard</h1>
              <p className="text-sm text-green-600 mt-1">Manage subsidies, producers, and wallet verification</p>
            </div>
            
            {/* Crypto Wallet Connection */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-64 border-green-200 focus:border-green-400"
                />
                <Button 
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet || !walletAddress.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnectingWallet ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { key: "overview", label: "Overview", icon: TrendingUp },
              { key: "subsidies", label: "Subsidies", icon: DollarSign },
              { key: "producers", label: "Producers", icon: Users },
              { key: "wallet", label: "Wallet Verification", icon: Wallet },
              { key: "reports", label: "Reports", icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <Button 
                key={key} 
                variant={tab === key ? "default" : "outline"} 
                onClick={() => setTab(key as any)}
                className={tab === key ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700 hover:bg-green-50"}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-green-600">Loading...</span>
          </div>
        )}

        {/* Overview */}
        {tab === "overview" && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard title="Total Applications" value={stats.total} icon={FileText} trend="+12% this month" />
              <StatCard title="Pending Review" value={stats.pending} icon={Clock} trend="3 urgent" />
              <StatCard title="Approved" value={stats.approved} icon={CheckCircle} trend="+8% this week" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} />
              <StatCard title="Terminated" value={stats.terminated} icon={AlertTriangle} />
              <StatCard title="Total Disbursed" value={stats.disbursed} icon={DollarSign} trend="+15% this quarter" />
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {subsidies.slice(0, 5).map(s => (
                  <div key={s._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">{s.producer?.name || "Unknown Producer"}</span>
                      <span className="text-sm text-green-600">requested ${s.amount?.toLocaleString() || 0}</span>
                    </div>
                    {getStatusBadge(s.status)}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Subsidies */}
        {tab === "subsidies" && !loading && (
          <Card className="overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100">
              <h2 className="text-xl font-semibold text-green-800">Subsidy Applications</h2>
              <p className="text-sm text-green-600 mt-1">Review and manage all subsidy requests</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-left p-4 font-medium text-green-800">Producer</th>
                    <th className="text-left p-4 font-medium text-green-800">Project</th>
                    <th className="text-left p-4 font-medium text-green-800">Amount</th>
                    <th className="text-left p-4 font-medium text-green-800">Status</th>
                    <th className="text-left p-4 font-medium text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidies.map((s, index) => (
                    <tr key={s._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{s.producer?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{s.producer?.email || ""}</div>
                      </td>
                      <td className="p-4 text-gray-700">{s.description || "No description"}</td>
                      <td className="p-4 font-semibold text-green-700">${s.amount?.toLocaleString() || 0}</td>
                      <td className="p-4">{getStatusBadge(s.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {s.status === "PENDING" && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleSubsidyAction(s._id, "APPROVE")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleSubsidyAction(s._id, "REJECT")}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {s.status === "APPROVED" && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleSubsidyAction(s._id, "TERMINATE")}
                              className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Terminate
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Producers */}
        {tab === "producers" && !loading && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-green-800">Producer Management</h2>
                  <p className="text-sm text-green-600 mt-1">Search and manage registered producers</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Producer
                </Button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search producers by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducers.map(p => (
                <Card key={p._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge variant={p.walletVerified ? "default" : "outline"} 
                           className={p.walletVerified ? "bg-green-100 text-green-700" : "text-gray-600"}>
                      {p.walletVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{p.email}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {!p.walletVerified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleWalletVerify(p._id, true)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Verification */}
        {tab === "wallet" && !loading && (
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Wallet Verification Queue</h2>
              <p className="text-sm text-green-600">Verify producer wallet addresses for subsidy payments</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {producers.map(p => (
                <Card key={p._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <p className="text-sm text-gray-600">{p.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Wallet Status:</span>
                          <Badge variant={p.walletVerified ? "default" : "outline"} 
                                 className={p.walletVerified ? "bg-green-100 text-green-700" : "text-yellow-600 border-yellow-200"}>
                            {p.walletVerified ? "Verified" : "Pending Verification"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {!p.walletVerified && (
                      <Button 
                        onClick={() => handleWalletVerify(p._id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Wallet
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {tab === "reports" && !loading && (
          <Card className="overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100">
              <h2 className="text-xl font-semibold text-green-800">Financial Reports</h2>
              <p className="text-sm text-green-600 mt-1">Overview of all subsidy disbursements and project status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-left p-4 font-medium text-green-800">Project</th>
                    <th className="text-left p-4 font-medium text-green-800">Producer</th>
                    <th className="text-left p-4 font-medium text-green-800">Amount</th>
                    <th className="text-left p-4 font-medium text-green-800">Status</th>
                    <th className="text-left p-4 font-medium text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, index) => (
                    <tr key={r._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-gray-900">{r.description || "No description"}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{r.producer?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{r.producer?.email || ""}</div>
                      </td>
                      <td className="p-4 font-semibold text-green-700">${r.amount?.toLocaleString() || 0}</td>
                      <td className="p-4">{getStatusBadge(r.status)}</td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost">
                          <FileText className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}