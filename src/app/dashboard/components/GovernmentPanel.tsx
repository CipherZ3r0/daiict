// src/app/dashboard/components/GovernmentPanel.tsx - Government official dashboard
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProjectCard from '@/components/ProjectCard'
import WalletConnectButton from '@/components/WalletConnectButton'
import { useToast } from '@/components/ui/use-toast'
import { apiService } from '@/lib/api'
import { lockFunds } from '@/lib/blockchain'
import { FileText, CheckCircle2, XCircle, AlertTriangle, Lock, Users } from 'lucide-react'

interface User {
  id: string
  name: string
  role: string
}

interface Project {
  _id: string
  name: string
  description: string
  producerId: string
  producerName: string
  status: string
  grantTotal?: number
  milestones: any[]
  createdAt: string
}

interface GovernmentPanelProps {
  user: User
}

export default function GovernmentPanel({ user }: GovernmentPanelProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveProject = async (projectId: string, grantAmount: number, milestones: any[]) => {
    try {
      const updatedProject = await apiService.updateProject(projectId, {
        status: 'Approved',
        grantTotal: grantAmount,
        milestones: milestones
      })

      // Update local state
      setProjects(prev => prev.map(p => 
        p._id === projectId ? { ...p, ...updatedProject } : p
      ))

      toast({
        title: "Project Approved",
        description: "Project has been approved successfully. You can now lock funds."
      })
    } catch (error) {
      console.error('Error approving project:', error)
      toast({
        title: "Error",
        description: "Failed to approve project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRejectProject = async (projectId: string, reason: string) => {
    try {
      const updatedProject = await apiService.updateProject(projectId, {
        status: 'Rejected',
        rejectionReason: reason
      })

      setProjects(prev => prev.map(p => 
        p._id === projectId ? { ...p, ...updatedProject } : p
      ))

      toast({
        title: "Project Rejected",
        description: "Project has been rejected."
      })
    } catch (error) {
      console.error('Error rejecting project:', error)
      toast({
        title: "Error",
        description: "Failed to reject project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleFlagProject = async (projectId: string, reason: string) => {
    try {
      const updatedProject = await apiService.updateProject(projectId, {
        status: 'Flagged',
        flagReason: reason
      })

      setProjects(prev => prev.map(p => 
        p._id === projectId ? { ...p, ...updatedProject } : p
      ))

      toast({
        title: "Project Flagged",
        description: "Project has been flagged for auditor review."
      })
    } catch (error) {
      console.error('Error flagging project:', error)
      toast({
        title: "Error",
        description: "Failed to flag project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleLockFunds = async (projectId: string, amount: number) => {
    try {
      // TODO: Replace with actual blockchain integration
      const txHash = await lockFunds(projectId, amount)
      
      // Update project with contract address/tx hash
      await apiService.updateProject(projectId, {
        contractAddress: txHash, // In real implementation, this would be the contract address
        fundsLocked: true
      })

      toast({
        title: "Funds Locked",
        description: `Funds locked on blockchain. Transaction: ${txHash.slice(0, 10)}...`,
      })
    } catch (error) {
      console.error('Error locking funds:', error)
      toast({
        title: "Error",
        description: "Failed to lock funds on blockchain. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getProjectsByStatus = (status: string) => {
    return projects.filter(p => {
      switch (status) {
        case 'pending':
          return p.status === 'Applied'
        case 'approved':
          return p.status === 'Approved'
        case 'flagged':
          return p.status === 'Flagged'
        case 'all':
          return true
        default:
          return false
      }
    })
  }

  const getStatusStats = () => {
    return {
      pending: projects.filter(p => p.status === 'Applied').length,
      approved: projects.filter(p => p.status === 'Approved').length,
      flagged: projects.filter(p => p.status === 'Flagged').length,
      total: projects.length
    }
  }

  const stats = getStatusStats()

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Management</h2>
          <p className="text-gray-600">Review applications and manage funding approvals</p>
        </div>
        <WalletConnectButton userRole={user.role} />
      </div>

      {/* Projects Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({stats.flagged})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'flagged', 'all'].map(status => (
          <TabsContent key={status} value={status} className="mt-6">
            {getProjectsByStatus(status).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No {status === 'all' ? '' : status} projects
                  </h3>
                  <p className="text-gray-600">
                    {status === 'pending' && "No pending applications to review"}
                    {status === 'approved' && "No approved projects yet"}
                    {status === 'flagged' && "No flagged projects"}
                    {status === 'all' && "No projects in the system"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {getProjectsByStatus(status).map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    userRole={user.role}
                    onApprove={handleApproveProject}
                    onReject={handleRejectProject}
                    onFlag={handleFlagProject}
                    onLockFunds={handleLockFunds}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}