import { NextRequest, NextResponse } from 'next/server'
import { Project, PROJECT_STATUS, MILESTONE_STATUS } from '@/lib/constants'

// In-memory storage for demo purposes
// In production, this would be replaced with a proper database (MongoDB, PostgreSQL, etc.)
let projects: Project[] = [
  // Sample projects for demonstration
  {
    id: 'project-1',
    name: 'Green Hydrogen Production Facility - Phase 1',
    description: 'Development of a 50MW green hydrogen production facility using renewable energy sources. This project aims to produce clean hydrogen for industrial applications and transportation.',
    producerName: 'John Smith',
    status: PROJECT_STATUS.IN_PROGRESS,
    totalSubsidy: 2500000,
    milestones: [
      {
        id: 'milestone-1-1',
        title: 'Site Preparation and Permits',
        description: 'Complete site preparation work and obtain all necessary environmental permits and approvals.',
        targetDate: '2025-03-15',
        status: MILESTONE_STATUS.VERIFIED,
        verifiedBy: 'Alice Johnson',
        verifiedAt: '2025-02-15T10:30:00Z',
        subsidyAmount: 500000,
      },
      {
        id: 'milestone-1-2',
        title: 'Equipment Procurement and Installation',
        description: 'Procure and install electrolysis equipment, renewable energy systems, and supporting infrastructure.',
        targetDate: '2025-06-30',
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: 1500000,
      },
      {
        id: 'milestone-1-3',
        title: 'Commissioning and Testing',
        description: 'Complete system commissioning, safety testing, and begin initial hydrogen production.',
        targetDate: '2025-09-15',
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: 500000,
      },
    ],
    createdAt: '2024-12-01T08:00:00Z',
    updatedAt: '2025-02-15T10:30:00Z',
  },
  {
    id: 'project-2',
    name: 'Hydrogen Transport Infrastructure',
    description: 'Building hydrogen refueling stations and distribution network for clean transportation in the metropolitan area.',
    producerName: 'Sarah Davis',
    status: PROJECT_STATUS.SUBMITTED,
    totalSubsidy: 1800000,
    milestones: [
      {
        id: 'milestone-2-1',
        title: 'Network Design and Planning',
        description: 'Complete network design, site selection, and regulatory approvals for hydrogen refueling stations.',
        targetDate: '2025-04-01',
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: 400000,
      },
      {
        id: 'milestone-2-2',
        title: 'Station Construction Phase 1',
        description: 'Build first 5 hydrogen refueling stations at strategic locations.',
        targetDate: '2025-08-15',
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: 800000,
      },
      {
        id: 'milestone-2-3',
        title: 'Network Integration and Operations',
        description: 'Integrate stations into existing fuel network and begin commercial operations.',
        targetDate: '2025-11-30',
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: 600000,
      },
    ],
    createdAt: '2024-11-15T14:20:00Z',
    updatedAt: '2024-11-15T14:20:00Z',
  },
]

// GET /api/projects - Retrieve all projects
export async function GET(request: NextRequest) {
  try {
    // In a real application, you might want to implement filtering, pagination, etc.
    // You could also filter by user role or other criteria based on query parameters
    
    const url = new URL(request.url)
    const producerName = url.searchParams.get('producer')
    const status = url.searchParams.get('status')
    
    let filteredProjects = projects
    
    // Filter by producer name if specified
    if (producerName) {
      filteredProjects = filteredProjects.filter(
        project => project.producerName.toLowerCase().includes(producerName.toLowerCase())
      )
    }
    
    // Filter by status if specified
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status)
    }
    
    return NextResponse.json({
      success: true,
      projects: filteredProjects,
      total: filteredProjects.length,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        projects: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, description, producerName, totalSubsidy, milestones } = body
    
    if (!name || !description || !producerName || !totalSubsidy || !milestones) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, description, producerName, totalSubsidy, milestones' 
        },
        { status: 400 }
      )
    }
    
    // Validate milestones
    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'At least one milestone is required' 
        },
        { status: 400 }
      )
    }
    
    // Validate each milestone
    for (const milestone of milestones) {
      if (!milestone.title || !milestone.description || !milestone.targetDate || !milestone.subsidyAmount) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Each milestone must have title, description, targetDate, and subsidyAmount' 
          },
          { status: 400 }
        )
      }
    }
    
    // Create new project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      producerName: producerName.trim(),
      status: PROJECT_STATUS.SUBMITTED,
      totalSubsidy: parseFloat(totalSubsidy),
      milestones: milestones.map((milestone: any, index: number) => ({
        id: `milestone-${Date.now()}-${index}`,
        title: milestone.title.trim(),
        description: milestone.description.trim(),
        targetDate: milestone.targetDate,
        status: MILESTONE_STATUS.PENDING,
        subsidyAmount: parseFloat(milestone.subsidyAmount),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Add to in-memory storage
    // In production, this would be saved to a database
    projects.push(newProject)
    
    // Log project creation for blockchain integration
    console.log(`New project created: ${newProject.id}`)
    console.log(`Producer: ${newProject.producerName}`)
    console.log(`Total Subsidy: $${newProject.totalSubsidy}`)
    console.log(`Milestones: ${newProject.milestones.length}`)
    
    // TODO: Integrate with blockchain
    // This is where you would:
    // 1. Create a smart contract for the project
    // 2. Lock subsidy funds in escrow
    // 3. Set up milestone verification triggers
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: newProject,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/projects - Update an existing project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, ...updateData } = body
    
    if (!projectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find project index
    const projectIndex = projects.findIndex(project => project.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }
    
    // Update project
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    
    // Log project update for blockchain integration
    console.log(`Project updated: ${projectId}`)
    
    // TODO: Integrate with blockchain
    // Update project status on blockchain if needed
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: projects[projectIndex],
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update project' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/projects - Delete a project (for development/admin use)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')
    
    if (!projectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find project index
    const projectIndex = projects.findIndex(project => project.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }
    
    // Remove project
    const deletedProject = projects.splice(projectIndex, 1)[0]
    
    console.log(`Project deleted: ${projectId}`)
    
    // TODO: Integrate with blockchain
    // Handle project deletion on blockchain (if allowed by business rules)
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      project: deletedProject,
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete project' 
      },
      { status: 500 }
    )
  }
}