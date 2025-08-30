"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "producer" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Submitting form:");
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) setMessage("✅ User created successfully!");
    else setMessage(`❌ ${data.error || "Error"}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-emerald-700">Register</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Register
            </Button>
          </form>

          {message && (
            <p className="text-center text-sm font-medium mt-2 text-gray-700">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
