import { NextRequest, NextResponse } from 'next/server'
import { Project, MILESTONE_STATUS } from '@/lib/constants'
import { verifyMilestoneOnChain, releaseFunds } from '@/lib/blockchain'

// Import the projects data from the projects API
// In production, this would be shared through a database
// For demo purposes, we'll maintain a reference to the same in-memory storage

// This would typically be imported from a shared database module
// For simplicity, we're maintaining the same data structure here
let projects: Project[] = []

// Helper function to load projects (in production, this would query the database)
async function loadProjects() {
  // In production, this would be a database query
  // For demo purposes, we'll fetch from the projects API
  try {
    // Since we're in the same server, we can't make HTTP requests to ourselves
    // In a real app, this would be a shared database connection
    // For now, we'll simulate having access to the same data
    return projects
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

// Helper function to save projects (in production, this would update the database)
async function saveProjects(updatedProjects: Project[]) {
  // In production, this would be a database update
  projects = updatedProjects
  return true
}

// PUT /api/milestones - Update milestone verification status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      projectId, 
      milestoneId, 
      status, 
      verifiedBy, 
      verifiedAt, 
      rejectionReason 
    } = body
    
    // Validate required fields
    if (!projectId || !milestoneId || !status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: projectId, milestoneId, status' 
        },
        { status: 400 }
      )
    }
    
    // Validate status value
    if (!Object.values(MILESTONE_STATUS).includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid milestone status' 
        },
        { status: 400 }
      )
    }
    
    // Load current projects data
    const currentProjects = await loadProjects()
    
    // Find the project
    const projectIndex = currentProjects.findIndex(project => project.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }
    
    // Find the milestone
    const project = currentProjects[projectIndex]
    const milestoneIndex = project.milestones.findIndex(milestone => milestone.id === milestoneId)
    if (milestoneIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Milestone not found' 
        },
        { status: 404 }
      )
    }
    
    const milestone = project.milestones[milestoneIndex]
    
    // Update milestone status
    const updatedMilestone = {
      ...milestone,
      status,
      verifiedBy: verifiedBy || milestone.verifiedBy,
      verifiedAt: verifiedAt || milestone.verifiedAt,
      ...(rejectionReason && { rejectionReason }),
    }
    
    // Update the milestone in the project
    currentProjects[projectIndex].milestones[milestoneIndex] = updatedMilestone
    currentProjects[projectIndex].updatedAt = new Date().toISOString()
    
    // Save updated projects
    await saveProjects(currentProjects)
    
    // Log milestone verification for blockchain integration
    console.log(`Milestone ${milestoneId} status updated to ${status}`)
    console.log(`Project: ${projectId}`)
    console.log(`Verified by: ${verifiedBy}`)
    
    // TODO: Integrate with blockchain
    if (status === MILESTONE_STATUS.VERIFIED) {
      try {
        // Record milestone verification on blockchain
        console.log('Recording milestone verification on blockchain...')
        // const txHash = await verifyMilestoneOnChain(projectId, milestoneIndex, verifiedBy)
        // console.log(`Blockchain verification transaction: ${txHash}`)
        
        // Release subsidy funds
        console.log('Releasing subsidy funds...')
        // const fundsReleased = await releaseFunds(projectId, milestoneIndex)
        
        // if (fundsReleased) {
        //   console.log(`Funds released for milestone ${milestoneId}: ${milestone.subsidyAmount}`)
        // } else {
        //   console.error('Failed to release funds on blockchain')
        // }
        
        // For demo purposes, we'll simulate successful blockchain interaction
        console.log(`✅ Simulated blockchain verification and fund release for milestone ${milestoneId}`)
        console.log(`💰 Simulated fund release: ${milestone.subsidyAmount}`)
        
      } catch (blockchainError) {
        console.error('Blockchain integration error:', blockchainError)
        // In production, you might want to revert the milestone status
        // or handle this error appropriately
      }
    }
    
    // Update project status based on milestone completion
    const verifiedMilestones = currentProjects[projectIndex].milestones.filter(
      m => m.status === MILESTONE_STATUS.VERIFIED
    ).length
    const totalMilestones = currentProjects[projectIndex].milestones.length
    
    // Update project status if all milestones are verified
    if (verifiedMilestones === totalMilestones) {
      currentProjects[projectIndex].status = 'completed'
      console.log(`Project ${projectId} marked as completed - all milestones verified`)
    } else if (verifiedMilestones > 0) {
      currentProjects[projectIndex].status = 'in_progress'
    }
    
    await saveProjects(currentProjects)
    
    return NextResponse.json({
      success: true,
      message: 'Milestone status updated successfully',
      milestone: updatedMilestone,
      project: currentProjects[projectIndex],
    })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update milestone status' 
      },
      { status: 500 }
    )
  }
}

// GET /api/milestones - Get milestones for a specific project or all pending milestones
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const status = url.searchParams.get('status')
    const auditorName = url.searchParams.get('auditor')
    
    const currentProjects = await loadProjects()
    
    let milestones: any[] = []
    
    if (projectId) {
      // Get milestones for a specific project
      const project = currentProjects.find(p => p.id === projectId)
      if (project) {
        milestones = project.milestones.map(milestone => ({
          ...milestone,
          projectId: project.id,
          projectName: project.name,
          producerName: project.producerName,
        }))
      }
    } else {
      // Get all milestones across all projects
      milestones = currentProjects.flatMap(project =>
        project.milestones.map(milestone => ({
          ...milestone,
          projectId: project.id,
          projectName: project.name,
          producerName: project.producerName,
        }))
      )
    }
    
    // Filter by status if specified
    if (status) {
      milestones = milestones.filter(milestone => milestone.status === status)
    }
    
    // Filter by auditor if specified
    if (auditorName) {
      milestones = milestones.filter(milestone => milestone.verifiedBy === auditorName)
    }
    
    return NextResponse.json({
      success: true,
      milestones,
      total: milestones.length,
    })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch milestones',
        milestones: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}

// POST /api/milestones - Add a new milestone to an existing project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, title, description, targetDate, subsidyAmount } = body
    
    // Validate required fields
    if (!projectId || !title || !description || !targetDate || !subsidyAmount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: projectId, title, description, targetDate, subsidyAmount' 
        },
        { status: 400 }
      )
    }
    
    const currentProjects = await loadProjects()
    
    // Find the project
    const projectIndex = currentProjects.findIndex(project => project.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }
    
    // Create new milestone
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      targetDate,
      status: MILESTONE_STATUS.PENDING,
      subsidyAmount: parseFloat(subsidyAmount),
    }
    
    // Add milestone to project
    currentProjects[projectIndex].milestones.push(newMilestone)
    currentProjects[projectIndex].totalSubsidy += parseFloat(subsidyAmount)
    currentProjects[projectIndex].updatedAt = new Date().toISOString()
    
    await saveProjects(currentProjects)
    
    console.log(`New milestone added to project ${projectId}: ${newMilestone.id}`)
    
    return NextResponse.json({
      success: true,
      message: 'Milestone added successfully',
      milestone: newMilestone,
      project: currentProjects[projectIndex],
    })
  } catch (error) {
    console.error('Error adding milestone:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add milestone' 
      },
      { status: 500 }
    )
  }
}