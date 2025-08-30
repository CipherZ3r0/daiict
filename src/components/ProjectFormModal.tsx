// src/components/ProjectFormModal.tsx - Modal form for creating new projects
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, DollarSign } from 'lucide-react'

interface Milestone {
  description: string
  amount: number
}

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description: string; milestones: Milestone[] }) => void
  title: string
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit, title }: ProjectFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: '', amount: 0 }
  ])
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast({
        title: "Project Name Required",
        description: "Please enter a project name",
        variant: "destructive"
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a project description",
        variant: "destructive"
      })
      return
    }

    if (milestones.length === 0) {
      toast({
        title: "Milestones Required",
        description: "Please add at least one milestone",
        variant: "destructive"
      })
      return
    }

    // Validate milestones
    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i]
      if (!milestone.description.trim()) {
        toast({
          title: "Milestone Description Required",
          description: `Please enter a description for milestone ${i + 1}`,
          variant: "destructive"
        })
        return
      }
      if (milestone.amount <= 0) {
        toast({
          title: "Invalid Milestone Amount",
          description: `Milestone ${i + 1} amount must be greater than 0`,
          variant: "destructive"
        })
        return
      }
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      milestones
    })

    // Reset form
    setName('')
    setDescription('')
    setMilestones([{ description: '', amount: 0 }])
  }

  const addMilestone = () => {
    setMilestones(prev => [...prev, { description: '', amount: 0 }])
  }

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ))
  }

  const getTotalAmount = () => {
    return milestones.reduce((total, milestone) => total + milestone.amount, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill out the project details and define your milestones
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your green hydrogen project, its goals, and expected outcomes..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-base font-medium">Project Milestones</Label>
                <p className="text-sm text-gray-600">
                  Define key deliverables and their associated funding amounts
                </p>
              </div>
              <Button type="button" onClick={addMilestone} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        Milestone {index + 1}
                      </h4>
                      {milestones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`milestone-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`milestone-desc-${index}`}
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          placeholder="Describe what will be delivered in this milestone..."
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`milestone-amount-${index}`}>Funding Amount ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id={`milestone-amount-${index}`}
                            type="number"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
                            placeholder="0"
                            className="pl-10"
                            min="0"
                            step="1000"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Amount Display */}
            {milestones.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-900">Total Project Funding</span>
                    <span className="text-xl font-bold text-green-700">
                      ${getTotalAmount().toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}