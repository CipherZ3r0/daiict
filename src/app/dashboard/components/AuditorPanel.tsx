// src/app/dashboard/components/AuditorPanel.tsx - Auditor verification dashboard
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProjectCard from '@/components/ProjectCard'
import MilestoneCard from '@/components/MilestoneCard'
// Update the import path if the file is located elsewhere, for example:
import { useToast } from "@/hooks/use-toast"

// Or, if you have a local hook, adjust accordingly:
// import { useToast } from '../../components/ui/use-toast'
import apiService from '@/lib/api'
import { Shield, Clock, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react'

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

interface AuditorPanelProps {
  user: User
}

export default function AuditorPanel({ user }: AuditorPanelProps) {
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
      // Only show projects that are approved or flagged (need auditor attention)
      const relevantProjects = data.filter(p => 
        p.status === 'Approved' || p.status === 'Flagged'
      )
      setProjects(relevantProjects)
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

  const handleVerifyMilestone = async (
    projectId: string, 
    milestoneIndex: number, 
    action: 'approve' | 'reject', 
    comments: string
  ) => {
    try {
      const updatedProject = await apiService.verifyMilestone(projectId, milestoneIndex, {
        action,
        comments
      })

      // Update local state
      setProjects(prev => prev.map(p => 
        p._id === projectId ? { ...p, ...updatedProject } : p
      ))

      toast({
        title: action === 'approve' ? "Milestone Approved" : "Milestone Rejected",
        description: `Milestone has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
      })
    } catch (error) {
      console.error('Error verifying milestone:', error)
      toast({
        title: "Error",
        description: "Failed to verify milestone. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getProjectsWithPendingMilestones = () => {
    return projects.filter(project => 
      project.milestones.some(milestone => 
        milestone.proofUrls && milestone.proofUrls.length > 0 && !milestone.verified
      )
    )
  }

  const getFlaggedProjects = () => {
    return projects.filter(p => p.status === 'Flagged')
  }

  const getCompletedAudits = () => {
    return projects.filter(project => 
      project.milestones.every(milestone => milestone.verified === true)
    )
  }

  const getTotalMilestonesNeedingReview = () => {
    return projects.reduce((total, project) => {
      return total + project.milestones.filter(milestone => 
        milestone.proofUrls && milestone.proofUrls.length > 0 && milestone.verified !== true
      ).length
    }, 0)
  }

  const getStatusStats = () => {
    return {
      pendingMilestones: getTotalMilestonesNeedingReview(),
      flaggedProjects: getFlaggedProjects().length,
      completedAudits: getCompletedAudits().length,
      totalProjects: projects.length
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
                <p className="text-sm font-medium text-gray-600">Pending Milestones</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingMilestones}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Projects</p>
                <p className="text-2xl font-bold text-red-600">{stats.flaggedProjects}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Audits</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedAudits}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProjects}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Audit Dashboard</h2>
        <p className="text-gray-600">Review milestone proofs and verify project compliance</p>
      </div>

      {/* Audit Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Review ({stats.pendingMilestones})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged Projects ({stats.flaggedProjects})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completedAudits})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {getProjectsWithPendingMilestones().length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Reviews</h3>
                <p className="text-gray-600">
                  All milestones have been reviewed. Check back later for new submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {getProjectsWithPendingMilestones().map(project => (
                <Card key={project._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>
                          Producer: {project.producerName}
                        </CardDescription>
                      </div>
                      <Badge variant={project.status === 'Flagged' ? 'destructive' : 'default'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{project.description}</p>
                      
                      <div className="grid gap-4">
                        {project.milestones
                          .filter(milestone => 
                            milestone.proofUrls && milestone.proofUrls.length > 0 && milestone.verified !== true
                          )
                          .map((milestone, index) => (
                            <MilestoneCard
                              key={index}
                              milestone={milestone}
                              milestoneIndex={index}
                              projectId={project._id}
                              userRole={user.role}
                              onVerify={handleVerifyMilestone}
                            />
                          ))
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          {getFlaggedProjects().length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flagged Projects</h3>
                <p className="text-gray-600">
                  No projects currently flagged for review.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {getFlaggedProjects().map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  userRole={user.role}
                  onVerify={handleVerifyMilestone}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {getCompletedAudits().length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Audits</h3>
                <p className="text-gray-600">
                  No fully audited projects yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {getCompletedAudits().map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  userRole={user.role}
                  readonly={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}