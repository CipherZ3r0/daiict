// src/app/page.tsx - Landing page with hero section and Get Started button
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, Shield, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-green-100 rounded-full">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Green Hydrogen
          <span className="text-green-600 block">Subsidy Platform</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A blockchain-powered platform connecting green hydrogen producers with government funding, 
          ensuring transparent milestone verification and secure fund distribution.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              Get Started
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-8 py-3">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform streamlines the entire subsidy process from application to fund distribution
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Separate dashboards for Producers, Government officials, and Auditors
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Blockchain Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Smart contracts ensure secure fund locking and milestone-based releases
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Automated Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamlined milestone verification process with auditor oversight
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-orange-100 rounded-full w-fit">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Green Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dedicated to supporting sustainable green hydrogen projects
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Funds Distributed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Projects Funded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Verification Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="h-6 w-6 text-green-500 mr-2" />
            <span className="font-semibold">Green Hydrogen Platform</span>
          </div>
          <p className="text-gray-400">
            Empowering sustainable energy through transparent funding
          </p>
        </div>
      </footer>
    </div>
  )
}