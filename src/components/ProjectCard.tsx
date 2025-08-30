// src/components/ProjectCard.tsx - Project display card with role-based actions
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import MilestoneCard from '@/components/MilestoneCard'
import { useToast } from '@/components/ui/use-toast'
import { 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lock,
  Upload,
  Eye
} from 'lucide-react'

interface Milestone {
  index: number
  description: string
  amount: number
  verified?: boolean
  proofUrls?: string[]
  auditorComments?: string
}

interface Project {
  _id: string
  name: string
  description: string
  producerId: string
  producerName: string
  status: string
  grantTotal?: number
  milestones: Milestone[]
  contractAddress?: string
  createdAt: string
  updatedAt: string
}

interface ProjectCardProps {
  project: Project
  userRole: string
  onApprove?: (projectId: string, grantAmount: number, milestones: any[]) => void
  onReject?: (projectId: string, reason: string) => void
  onFlag?: (projectId: string, reason: string) => void
  onLockFunds?: (projectId: string, amount: number) => void
  onUploadProof?: (projectId: string, milestoneIndex: number, file: File) => void
  onVerify?: (projectId: string, milestoneIndex: number, action: 'approve' | 'reject', comments: string) => void
  readonly?: boolean
}

export default function ProjectCard({ 
  project, 
  userRole, 
  onApprove, 
  onReject, 
  onFlag, 
  onLockFunds, 
  onUploadProof,
  onVerify,
  readonly = false 
}: ProjectCardProps) {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [grantAmount, setGrantAmount] = useState(project.grantTotal || 0)
  const [rejectionReason, setRejectionReason] = useState('')
  const [flagReason, setFlagReason] = useState('')
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Flagged': return 'bg-yellow-100 text-yellow-800'
      case 'Terminated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canUploadProof = (milestone: Milestone) => {
    return userRole === 'Producer' && 
           project.status === 'Approved' && 
           (!milestone.proofUrls || milestone.proofUrls.length === 0)
  }

  const handleApproveSubmit = () => {
    if (grantAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Grant amount must be greater than 0",
        variant: "destructive"
      })
      return
    }

    onApprove?.(project._id, grantAmount, project.milestones)
    setShowApproveModal(false)
  }

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      })
      return
    }

    onReject?.(project._id, rejectionReason)
    setShowRejectModal(false)
    setRejectionReason('')
  }

  const handleFlagSubmit = () => {
    if (!flagReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for flagging",
        variant: "destructive"
      })
      return
    }

    onFlag?.(project._id, flagReason)
    setShowFlagModal(false)
    setFlagReason('')
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Producer: {project.producerName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            {project.grantTotal && (
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${project.grantTotal.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700">{project.description}</p>

        {/* Project Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </div>
          {project.contractAddress && (
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Contract: {project.contractAddress.slice(0, 10)}...
            </div>
          )}
        </div>

        {/* Milestones */}
        {project.milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Milestones</h4>
            <div className="space-y-2">
              {project.milestones.map((milestone, index) => (
                <MilestoneCard
                  key={index}
                  milestone={milestone}
                  milestoneIndex={index}
                  projectId={project._id}
                  userRole={userRole}
                  onUploadProof={onUploadProof}
                  onVerify={onVerify}
                  readonly={readonly}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!readonly && (
          <div className="flex gap-2 pt-4 border-t">
            {/* Producer Actions */}
            {userRole === 'Producer' && project.status === 'Draft' && (
              <Button size="sm">
                Submit Application
              </Button>
            )}

            {/* Government Actions */}
            {userRole === 'Government' && project.status === 'Applied' && (
              <>
                <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Project</DialogTitle>
                      <DialogDescription>
                        Set the grant amount and confirm milestone structure
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="grantAmount">Total Grant Amount ($)</Label>
                        <Input
                          id="grantAmount"
                          type="number"
                          value={grantAmount}
                          onChange={(e) => setGrantAmount(Number(e.target.value))}
                          placeholder="Enter grant amount"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleApproveSubmit} className="flex-1">
                          Approve Project
                        </Button>
                        <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Project</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rejectionReason">Rejection Reason</Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleRejectSubmit} className="flex-1">
                          Reject Project
                        </Button>
                        <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* Government Lock Funds Action */}
            {userRole === 'Government' && project.status === 'Approved' && !project.contractAddress && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onLockFunds?.(project._id, project.grantTotal || 0)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Funds
              </Button>
            )}

            {/* Government Flag Action */}
            {userRole === 'Government' && (project.status === 'Approved' || project.status === 'Applied') && (
              <Dialog open={showFlagModal} onOpenChange={setShowFlagModal}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Flag Project</DialogTitle>
                    <DialogDescription>
                      Flag this project for auditor review
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="flagReason">Reason for Flagging</Label>
                      <Textarea
                        id="flagReason"
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        placeholder="Enter reason for flagging..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleFlagSubmit} className="flex-1">
                        Flag Project
                      </Button>
                      <Button variant="outline" onClick={() => setShowFlagModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* View Details Button */}
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}