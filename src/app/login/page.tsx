// src/app/login/page.tsx - Guest login with name and role selection
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Leaf, User, Building, ShieldCheck } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type UserRole = 'Producer' | 'Government' | 'Auditor'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('Producer')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Store user info in localStorage for guest mode
      const user = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        role: selectedRole,
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${name}! Role: ${selectedRole}`,
      })
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'Producer' as UserRole,
      label: 'Green Hydrogen Producer',
      description: 'Apply for subsidies and upload milestone proofs',
      icon: Leaf,
      color: 'text-green-600'
    },
    {
      value: 'Government' as UserRole,
      label: 'Government Official',
      description: 'Review applications and manage funding',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      value: 'Auditor' as UserRole,
      label: 'Independent Auditor',
      description: 'Verify milestones and approve fund releases',
      icon: ShieldCheck,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your details to access the Green Hydrogen Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Select Your Role</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole as (value: string) => void}>
                {roleOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div className="flex items-center space-x-3 flex-1">
                        <IconComponent className={`h-5 w-5 ${option.color}`} />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Continue to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a guest mode login. No password required for demo purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}