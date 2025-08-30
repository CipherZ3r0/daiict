"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-green-600">
        Green Hydrogen Subsidy Platform
      </h1>
      <p className="text-gray-700 mb-8 text-center max-w-2xl">
        A transparent blockchain-powered platform where{" "}
        <strong>Producers</strong>, <strong>Government</strong>, and{" "}
        <strong>Auditors</strong> collaborate on subsidy applications,
        milestone tracking, and fund disbursement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Producer */}
        <Link
          href="/producer"
          className="p-6 rounded-xl shadow-md bg-white hover:bg-green-50 transition"
        >
          <h2 className="text-2xl font-semibold text-green-700">Producer</h2>
          <p className="text-gray-600 mt-2">
            Apply for subsidies, upload milestone documents, and track funding
            status.
          </p>
        </Link>

        {/* Government */}
        <Link
          href="/government"
          className="p-6 rounded-xl shadow-md bg-white hover:bg-green-50 transition"
        >
          <h2 className="text-2xl font-semibold text-blue-700">Government</h2>
          <p className="text-gray-600 mt-2">
            Manage subsidy applications, approve or reject requests, allocate
            funds, and create milestones.
          </p>
        </Link>

        {/* Auditor */}
        <Link
          href="/auditor"
          className="p-6 rounded-xl shadow-md bg-white hover:bg-green-50 transition"
        >
          <h2 className="text-2xl font-semibold text-purple-700">Auditor</h2>
          <p className="text-gray-600 mt-2">
            Verify milestone reports, validate fund usage, and approve or reject
            project progress.
          </p>
        </Link>
      </div>
    </main>
  );
}
