// src/app/dashboard/components/ProducerPanel.tsx - Producer-specific dashboard
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProjectCard from '@/components/ProjectCard'
import ProjectFormModal from '@/components/ProjectFormModal'
import WalletConnectButton from '@/components/WalletConnectButton'
import { useToast } from "@/hooks/use-toast"
import { apiService } from '@/lib/api'
import { Plus, Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react'

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

interface ProducerPanelProps {
  user: User
}

export default function ProducerPanel({ user }: ProducerPanelProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getProjects()
      // Filter projects for this producer
      const producerProjects = data.filter(p => p.producerId === user.id)
      setProjects(producerProjects)
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

  const handleCreateProject = async (projectData: { name: string; description: string; milestones: any[] }) => {
    try {
      const newProject = await apiService.createProject({
        name: projectData.name,
        description: projectData.description,
        producerId: user.id,
        milestones: projectData.milestones
      })
      
      setProjects(prev => [newProject, ...prev])
      setShowCreateModal(false)
      
      toast({
        title: "Project Created",
        description: "Your project application has been submitted successfully."
      })
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUploadProof = async (projectId: string, milestoneIndex: number, file: File) => {
    try {
      const fileUrl = await apiService.uploadMilestoneProof(projectId, milestoneIndex, file)
      
      // Update the project in local state
      setProjects(prev => prev.map(project => {
        if (project._id === projectId) {
          const updatedMilestones = [...project.milestones]
          if (updatedMilestones[milestoneIndex]) {
            updatedMilestones[milestoneIndex].proofUrls = [
              ...(updatedMilestones[milestoneIndex].proofUrls || []),
              fileUrl
            ]
          }
          return { ...project, milestones: updatedMilestones }
        }
        return project
      }))
      
      toast({
        title: "Proof Uploaded",
        description: "Milestone proof has been uploaded successfully."
      })
    } catch (error) {
      console.error('Error uploading proof:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload proof. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusStats = () => {
    const stats = {
      draft: projects.filter(p => p.status === 'Draft').length,
      pending: projects.filter(p => p.status === 'Applied').length,
      approved: projects.filter(p => p.status === 'Approved').length,
      rejected: projects.filter(p => p.status === 'Rejected').length
    }
    return stats
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
                <p className="text-sm font-medium text-gray-600">Draft Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
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
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
          <p className="text-gray-600">Manage your subsidy applications and milestone submissions</p>
        </div>
        <div className="flex gap-3">
          <WalletConnectButton userRole={user.role} />
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first green hydrogen project application
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              userRole={user.role}
              onUploadProof={handleUploadProof}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <ProjectFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          title="Create New Project Application"
        />
      )}
    </div>
  )
}