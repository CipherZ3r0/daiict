// Constants for the Green Hydrogen Platform

export const USER_ROLES = {
  PRODUCER: 'Producer',
  GOVERNMENT: 'Government',
  AUDITOR: 'Auditor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const MILESTONE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export type MilestoneStatus = typeof MILESTONE_STATUS[keyof typeof MILESTONE_STATUS];

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  subsidyAmount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  producerName: string;
  status: ProjectStatus;
  totalSubsidy: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  role: UserRole;
}

// Colors for consistent styling
export const COLORS = {
  PRIMARY: '#16a34a',
  PRIMARY_LIGHT: '#22c55e',
  PRIMARY_DARK: '#15803d',
  BACKGROUND: '#f0fdf4',
  WHITE: '#ffffff',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_600: '#4b5563',
  GRAY_800: '#1f2937',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
} as const;