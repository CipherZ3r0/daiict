import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProducerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">Producer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Subsidy Programs */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Active Subsidy Programs</h2>
            <p className="text-sm text-gray-600">View and apply for available subsidies.</p>
            <Button className="mt-3">View Subsidies</Button>
          </CardContent>
        </Card>

        {/* My Applications */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">My Applications</h2>
            <p className="text-sm text-gray-600">Track your submitted applications.</p>
            <Button className="mt-3">View Applications</Button>
          </CardContent>
        </Card>

        {/* Milestone Upload */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Milestone Updates</h2>
            <p className="text-sm text-gray-600">Upload project progress reports.</p>
            <Button className="mt-3">Upload</Button>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Wallet</h2>
            <p className="text-sm text-gray-600">Balance: 1200 GHT</p>
            <Button className="mt-3">View Transactions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
