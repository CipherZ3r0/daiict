// src/components/MilestoneCard.tsx - Individual milestone display and verification
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { 
  DollarSign, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Image,
  ExternalLink,
  Clock
} from 'lucide-react'

interface Milestone {
  index: number
  description: string
  amount: number
  verified?: boolean
  proofUrls?: string[]
  auditorComments?: string
}

interface MilestoneCardProps {
  milestone: Milestone
  milestoneIndex: number
  projectId: string
  userRole: string
  onUploadProof?: (projectId: string, milestoneIndex: number, file: File) => void
  onVerify?: (projectId: string, milestoneIndex: number, action: 'approve' | 'reject', comments: string) => void
  readonly?: boolean
}

export default function MilestoneCard({ 
  milestone, 
  milestoneIndex, 
  projectId, 
  userRole, 
  onUploadProof,
  onVerify,
  readonly = false 
}: MilestoneCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject'>('approve')
  const [comments, setComments] = useState('')
  const [showProofModal, setShowProofModal] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }

    onUploadProof?.(projectId, milestoneIndex, selectedFile)
    setSelectedFile(null)
  }

  const handleVerifySubmit = () => {
    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide verification comments",
        variant: "destructive"
      })
      return
    }

    onVerify?.(projectId, milestoneIndex, verificationAction, comments)
    setShowVerifyModal(false)
    setComments('')
  }

  const getStatusIcon = () => {
    if (milestone.verified === true) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    } else if (milestone.verified === false) {
      return <XCircle className="h-4 w-4 text-red-600" />
    } else if (milestone.proofUrls && milestone.proofUrls.length > 0) {
      return <Clock className="h-4 w-4 text-orange-600" />
    }
    return null
  }

  const getStatusText = () => {
    if (milestone.verified === true) return 'Verified'
    if (milestone.verified === false) return 'Rejected'
    if (milestone.proofUrls && milestone.proofUrls.length > 0) return 'Pending Verification'
    return 'Awaiting Proof'
  }

  const getStatusColor = () => {
    if (milestone.verified === true) return 'bg-green-100 text-green-800'
    if (milestone.verified === false) return 'bg-red-100 text-red-800'
    if (milestone.proofUrls && milestone.proofUrls.length > 0) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              Milestone {milestoneIndex + 1}
            </CardTitle>
            <CardDescription>{milestone.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              ${milestone.amount.toLocaleString()}
            </Badge>
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Proof Files Display */}
        {milestone.proofUrls && milestone.proofUrls.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Proofs</Label>
            <div className="flex flex-wrap gap-2">
              {milestone.proofUrls.map((url, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center gap-2"
                >
                  {url.includes('.pdf') ? <FileText className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                  Proof {index + 1}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
              <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View All Proofs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Milestone {milestoneIndex + 1} - Proof Documents</DialogTitle>
                    <DialogDescription>{milestone.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {milestone.proofUrls.map((url, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Proof Document {index + 1}</span>
                          <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </div>
                        {url.includes('.pdf') ? (
                          <div className="bg-gray-100 p-8 text-center rounded">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">PDF Document</p>
                          </div>
                        ) : (
                          <img 
                            src={url} 
                            alt={`Proof ${index + 1}`}
                            className="w-full max-h-64 object-contain rounded border"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Auditor Comments */}
        {milestone.auditorComments && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-blue-900">Auditor Comments</Label>
            <p className="text-sm text-blue-800 mt-1">{milestone.auditorComments}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!readonly && (
          <div className="flex gap-2 pt-2">
            {/* Producer Upload Action */}
            {userRole === 'Producer' && 
             (!milestone.proofUrls || milestone.proofUrls.length === 0) && 
             milestone.verified !== true && (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            )}

            {/* Auditor Verification Actions */}
            {userRole === 'Auditor' && 
             milestone.proofUrls && 
             milestone.proofUrls.length > 0 && 
             milestone.verified === undefined && (
              <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Verify Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Milestone</DialogTitle>
                    <DialogDescription>
                      Review the uploaded proofs and provide your verification decision
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Verification Decision</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={verificationAction === 'approve' ? 'default' : 'outline'}
                          onClick={() => setVerificationAction('approve')}
                          className="flex-1"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant={verificationAction === 'reject' ? 'destructive' : 'outline'}
                          onClick={() => setVerificationAction('reject')}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="verificationComments">Comments</Label>
                      <Textarea
                        id="verificationComments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter your verification comments..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleVerifySubmit} className="flex-1">
                        Submit Verification
                      </Button>
                      <Button variant="outline" onClick={() => setShowVerifyModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}