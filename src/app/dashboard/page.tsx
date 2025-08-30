// src/app/dashboard/page.tsx - Role-based dashboard main page
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProducerPanel from '@/app/dashboard/components/ProducerPanel'
import GovernmentPanel from '@/app/dashboard/components/GovernmentPanel'
import AuditorPanel from '@/app/dashboard/components/AuditorPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { checkMockMode } from '@/lib/api'
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'

interface User {
  id: string
  name: string
  role: 'Producer' | 'Government' | 'Auditor'
  loginTime: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isMockMode, setIsMockMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem('currentUser')
    if (!userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
      return
    }

    // Check if we're in mock mode
    const checkBackendStatus = async () => {
      const mockStatus = await checkMockMode()
      setIsMockMode(mockStatus)
      setIsOnline(!mockStatus)
    }

    checkBackendStatus()
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const renderRolePanel = () => {
    switch (user.role) {
      case 'Producer':
        return <ProducerPanel user={user} />
      case 'Government':
        return <GovernmentPanel user={user} />
      case 'Auditor':
        return <AuditorPanel user={user} />
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Unknown Role</CardTitle>
              <CardDescription>Please contact support</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Mock Mode Warning Banner */}
        {isMockMode && (
          <Alert className="mb-6 border-yellow-400 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>OFFLINE/MOCK MODE:</strong> Backend and blockchain actions are simulated. 
              Data will not persist between sessions.
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role} Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Role-specific Dashboard Content */}
        {renderRolePanel()}
      </div>
    </div>
  )
}