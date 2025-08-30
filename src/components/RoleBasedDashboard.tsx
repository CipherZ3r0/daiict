'use client'

import { useState } from 'react'
import { User, Project, USER_ROLES, COLORS, PROJECT_STATUS, MILESTONE_STATUS } from '@/lib/constants'
import ProjectCard from './ProjectCard'

interface RoleBasedDashboardProps {
  user: User
  projects: Project[]
  loading: boolean
  onProjectsChange: () => void
}

export default function RoleBasedDashboard({ user, projects, loading, onProjectsChange }: RoleBasedDashboardProps) {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    totalSubsidy: '',
    milestones: [
      { title: '', description: '', targetDate: '', subsidyAmount: '' }
    ]
  })
  const [isCreating, setIsCreating] = useState(false)

  // Filter projects based on user role
  const getFilteredProjects = () => {
    switch (user.role) {
      case USER_ROLES.PRODUCER:
        return projects.filter(project => project.producerName === user.name)
      case USER_ROLES.GOVERNMENT:
      case USER_ROLES.AUDITOR:
        return projects
      default:
        return []
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        producerName: user.name,
        totalSubsidy: parseFloat(newProject.totalSubsidy),
        milestones: newProject.milestones.map((milestone, index) => ({
          id: `milestone-${Date.now()}-${index}`,
          title: milestone.title,
          description: milestone.description,
          targetDate: milestone.targetDate,
          subsidyAmount: parseFloat(milestone.subsidyAmount),
          status: MILESTONE_STATUS.PENDING,
        }))
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        setShowCreateProject(false)
        setNewProject({
          name: '',
          description: '',
          totalSubsidy: '',
          milestones: [{ title: '', description: '', targetDate: '', subsidyAmount: '' }]
        })
        onProjectsChange()
        alert('Project created successfully!')
      } else {
        alert('Failed to create project. Please try again.')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const addMilestone = () => {
    setNewProject(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', targetDate: '', subsidyAmount: '' }]
    }))
  }

  const removeMilestone = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    setNewProject(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const filteredProjects = getFilteredProjects()

  // Dashboard Statistics
  const getStats = () => {
    const totalProjects = filteredProjects.length
    const completedProjects = filteredProjects.filter(p => p.status === PROJECT_STATUS.COMPLETED).length
    const pendingMilestones = filteredProjects.reduce((acc, project) => 
      acc + project.milestones.filter(m => m.status === MILESTONE_STATUS.PENDING).length, 0
    )
    const totalSubsidyValue = filteredProjects.reduce((acc, project) => acc + project.totalSubsidy, 0)

    return { totalProjects, completedProjects, pendingMilestones, totalSubsidyValue }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: COLORS.GRAY_600,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${COLORS.PRIMARY}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          Loading dashboard data...
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Dashboard Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.GRAY_200}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: COLORS.PRIMARY,
            marginBottom: '0.5rem',
          }}>
            {stats.totalProjects}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: COLORS.GRAY_600,
            fontWeight: '500',
          }}>
            Total Projects
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.GRAY_200}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: COLORS.SUCCESS,
            marginBottom: '0.5rem',
          }}>
            {stats.completedProjects}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: COLORS.GRAY_600,
            fontWeight: '500',
          }}>
            Completed
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.GRAY_200}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: COLORS.WARNING,
            marginBottom: '0.5rem',
          }}>
            {stats.pendingMilestones}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: COLORS.GRAY_600,
            fontWeight: '500',
          }}>
            Pending Milestones
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.GRAY_200}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: COLORS.PRIMARY,
            marginBottom: '0.5rem',
          }}>
            ${stats.totalSubsidyValue.toLocaleString()}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: COLORS.GRAY_600,
            fontWeight: '500',
          }}>
            Total Subsidy Value
          </div>
        </div>
      </div>

      {/* Action Section for Producers */}
      {user.role === USER_ROLES.PRODUCER && (
        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.GRAY_200}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: COLORS.GRAY_800,
            }}>
              Your Projects
            </h3>
            <button
              onClick={() => setShowCreateProject(true)}
              style={{
                backgroundColor: COLORS.PRIMARY,
                color: COLORS.WHITE,
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.PRIMARY
              }}
            >
              + New Project
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: COLORS.WHITE,
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: COLORS.GRAY_800,
              }}>
                Create New Project
              </h2>
              <button
                onClick={() => setShowCreateProject(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: COLORS.GRAY_500,
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = COLORS.GRAY_800
                  e.currentTarget.style.backgroundColor = COLORS.GRAY_100
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = COLORS.GRAY_500
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Project Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: COLORS.GRAY_800,
                  marginBottom: '0.5rem',
                }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${COLORS.GRAY_200}`,
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: COLORS.GRAY_800,
                  marginBottom: '0.5rem',
                }}>
                  Description *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your green hydrogen project"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${COLORS.GRAY_200}`,
                    borderRadius: '6px',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              {/* Total Subsidy */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: COLORS.GRAY_800,
                  marginBottom: '0.5rem',
                }}>
                  Total Subsidy Amount (USD) *
                </label>
                <input
                  type="number"
                  value={newProject.totalSubsidy}
                  onChange={(e) => setNewProject(prev => ({ ...prev, totalSubsidy: e.target.value }))}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${COLORS.GRAY_200}`,
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                  required
                />
              </div>

              {/* Milestones */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: COLORS.GRAY_800,
                  }}>
                    Project Milestones *
                  </label>
                  <button
                    type="button"
                    onClick={addMilestone}
                    style={{
                      backgroundColor: COLORS.BACKGROUND,
                      color: COLORS.PRIMARY,
                      border: `1px solid ${COLORS.PRIMARY}`,
                      padding: '0.375rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Milestone
                  </button>
                </div>

                {newProject.milestones.map((milestone, index) => (
                  <div key={index} style={{
                    backgroundColor: COLORS.BACKGROUND,
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: `1px solid ${COLORS.GRAY_200}`,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: COLORS.GRAY_800,
                      }}>
                        Milestone {index + 1}
                      </h4>
                      {newProject.milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: COLORS.ERROR,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Milestone title"
                        style={{
                          padding: '0.5rem',
                          border: `1px solid ${COLORS.GRAY_300}`,
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                        required
                      />
                      
                      <textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                        placeholder="Milestone description"
                        style={{
                          padding: '0.5rem',
                          border: `1px solid ${COLORS.GRAY_300}`,
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          minHeight: '60px',
                          resize: 'vertical',
                        }}
                        required
                      />

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                          type="date"
                          value={milestone.targetDate}
                          onChange={(e) => updateMilestone(index, 'targetDate', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: `1px solid ${COLORS.GRAY_300}`,
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                          }}
                          required
                        />
                        
                        <input
                          type="number"
                          value={milestone.subsidyAmount}
                          onChange={(e) => updateMilestone(index, 'subsidyAmount', e.target.value)}
                          placeholder="Subsidy amount"
                          min="0"
                          step="0.01"
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: `1px solid ${COLORS.GRAY_300}`,
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: `1px solid ${COLORS.GRAY_200}`,
              }}>
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: COLORS.GRAY_600,
                    border: `1px solid ${COLORS.GRAY_300}`,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    backgroundColor: isCreating ? COLORS.GRAY_300 : COLORS.PRIMARY,
                    color: COLORS.WHITE,
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div style={{
        backgroundColor: COLORS.WHITE,
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.GRAY_200}`,
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: COLORS.GRAY_800,
          marginBottom: '1.5rem',
        }}>
          {user.role === USER_ROLES.PRODUCER && 'Your Projects'}
          {user.role === USER_ROLES.GOVERNMENT && 'All Projects'}
          {user.role === USER_ROLES.AUDITOR && 'Projects for Verification'}
        </h2>

        {filteredProjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: COLORS.GRAY_500,
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>
              📁
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}>
              No projects found
            </h3>
            <p style={{
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}>
              {user.role === USER_ROLES.PRODUCER && 'Create your first green hydrogen project to get started.'}
              {user.role === USER_ROLES.GOVERNMENT && 'No projects have been submitted yet.'}
              {user.role === USER_ROLES.AUDITOR && 'No projects are currently available for verification.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
          }}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userRole={user.role}
                userName={user.name}
                onProjectChange={onProjectsChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}