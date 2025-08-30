// src/lib/api.ts - API wrapper with mock fallback logic

import { mockProjects, mockUsers } from './mocks';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
let USE_MOCK = false;
let mockMode = false;

// Check if backend is reachable
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend unreachable, switching to mock mode:', error);
    return false;
  }
}

// Initialize mock mode detection
export async function initializeApiMode(): Promise<boolean> {
  const isBackendOnline = await checkBackendHealth();
  mockMode = !isBackendOnline || USE_MOCK;
  return mockMode;
}

export function isMockMode(): boolean {
  return mockMode;
}

export function toggleMockMode(): void {
  USE_MOCK = !USE_MOCK;
  mockMode = USE_MOCK;
}

// Mock data store (in-memory for fallback mode)
let mockProjectsStore = [...mockProjects];
let nextProjectId = mockProjectsStore.length + 1;

// API wrapper functions
export async function fetchProjects(filter?: string) {
  if (mockMode) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let projects = [...mockProjectsStore];
    if (filter === 'government-open') {
      projects = projects.filter(p => p.status === 'Applied' || p.status === 'Draft');
    }
    return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  try {
    const url = filter ? `${API_BASE}/api/projects?filter=${filter}` : `${API_BASE}/api/projects`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed, falling back to mock data:', error);
    mockMode = true;
    return fetchProjects(filter);
  }
}

export async function createProject(projectData: {
  name: string;
  description: string;
  producerId: string;
  milestones: { description: string; amount: number }[];
}) {
  if (mockMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject = {
      _id: `mock-${nextProjectId++}`,
      ...projectData,
      producerName: mockUsers.find(u => u.id === projectData.producerId)?.name || 'Unknown Producer',
      status: 'Draft' as const,
      grantTotal: null,
      milestones: projectData.milestones.map((m, index) => ({
        index,
        description: m.description,
        amount: m.amount,
        verified: false,
        proofUrls: [],
        auditorComments: null
      })),
      contractAddress: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProjectsStore.unshift(newProject);
    return { project: newProject };
  }

  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed, falling back to mock mode:', error);
    mockMode = true;
    return createProject(projectData);
  }
}

export async function updateProject(projectId: string, updateData: {
  status?: string;
  grantTotal?: number;
  milestones?: any[];
}) {
  if (mockMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const projectIndex = mockProjectsStore.findIndex(p => p._id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');
    
    mockProjectsStore[projectIndex] = {
      ...mockProjectsStore[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { project: mockProjectsStore[projectIndex] };
  }

  try {
    const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed, falling back to mock mode:', error);
    mockMode = true;
    return updateProject(projectId, updateData);
  }
}

export async function uploadMilestoneProof(projectId: string, milestoneIndex: number, file: File) {
  if (mockMode) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store file object in memory (for dev purposes)
    const mockFileUrl = `mock://uploaded/${file.name}`;
    const projectIndex = mockProjectsStore.findIndex(p => p._id === projectId);
    
    if (projectIndex !== -1) {
      const milestone = mockProjectsStore[projectIndex].milestones[milestoneIndex];
      if (milestone) {
        milestone.proofUrls.push(mockFileUrl);
        mockProjectsStore[projectIndex].updatedAt = new Date().toISOString();
      }
    }
    
    return { fileUrl: mockFileUrl };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('milestoneIndex', milestoneIndex.toString());

    const response = await fetch(`${API_BASE}/api/projects/${projectId}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Upload failed, falling back to mock mode:', error);
    mockMode = true;
    return uploadMilestoneProof(projectId, milestoneIndex, file);
  }
}

export async function verifyMilestone(projectId: string, milestoneIndex: number, action: 'approve' | 'reject', comments: string) {
  if (mockMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const projectIndex = mockProjectsStore.findIndex(p => p._id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');
    
    const milestone = mockProjectsStore[projectIndex].milestones[milestoneIndex];
    if (milestone) {
      milestone.verified = action === 'approve';
      milestone.auditorComments = comments;
      mockProjectsStore[projectIndex].updatedAt = new Date().toISOString();
    }
    
    return { 
      project: mockProjectsStore[projectIndex],
      milestone 
    };
  }

  try {
    const response = await fetch(`${API_BASE}/api/projects/${projectId}/milestones/${milestoneIndex}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comments })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed, falling back to mock mode:', error);
    mockMode = true;
    return verifyMilestone(projectId, milestoneIndex, action, comments);
  }
}

export async function verifyTransactionOnChain(txHash: string) {
  if (mockMode) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      status: 'confirmed',
      receipt: {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: '21000'
      }
    };
  }

  try {
    const response = await fetch(`${API_BASE}/api/transactions/verify-onchain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Transaction verification failed:', error);
    throw error;
  }
}