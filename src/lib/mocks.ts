// src/lib/mocks.ts - Mock data for offline/fallback mode

export interface User {
  id: string;
  name: string;
  role: 'Producer' | 'Government' | 'Auditor';
}

export interface Milestone {
  index: number;
  description: string;
  amount: number;
  verified: boolean;
  proofUrls: string[];
  auditorComments: string | null;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  producerId: string;
  producerName: string;
  status: 'Draft' | 'Applied' | 'Approved' | 'Rejected' | 'Flagged' | 'Terminated';
  grantTotal: number | null;
  milestones: Milestone[];
  contractAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: 'producer-1',
    name: 'GreenTech Solutions',
    role: 'Producer'
  },
  {
    id: 'producer-2', 
    name: 'HydroGen Corp',
    role: 'Producer'
  },
  {
    id: 'producer-3',
    name: 'Clean Energy Innovations',
    role: 'Producer'
  },
  {
    id: 'gov-1',
    name: 'Ministry of Renewable Energy',
    role: 'Government'
  },
  {
    id: 'auditor-1',
    name: 'Environmental Audit Agency',
    role: 'Auditor'
  }
];

// Mock projects with various statuses and milestones
export const mockProjects: Project[] = [
  {
    _id: 'project-1',
    name: 'Solar-Powered Hydrogen Plant',
    description: 'Construction of a 50MW solar-powered hydrogen production facility using advanced electrolysis technology.',
    producerId: 'producer-1',
    producerName: 'GreenTech Solutions',
    status: 'Approved',
    grantTotal: 2500000,
    milestones: [
      {
        index: 0,
        description: 'Site preparation and foundation laying',
        amount: 500000,
        verified: true,
        proofUrls: [
          'https://example.com/milestone1-photo1.jpg',
          'https://example.com/milestone1-report.pdf'
        ],
        auditorComments: 'Foundation work completed according to specifications. Site preparation meets all environmental standards.'
      },
      {
        index: 1,
        description: 'Electrolysis equipment installation',
        amount: 1500000,
        verified: false,
        proofUrls: [
          'https://example.com/milestone2-progress.jpg'
        ],
        auditorComments: null
      },
      {
        index: 2,
        description: 'System testing and commissioning',
        amount: 500000,
        verified: false,
        proofUrls: [],
        auditorComments: null
      }
    ],
    contractAddress: '0x1234567890123456789012345678901234567890',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-02-10T14:22:00.000Z'
  },
  {
    _id: 'project-2',
    name: 'Wind-Hydrogen Integration Project',
    description: 'Integration of wind farm with hydrogen production facility to create a renewable energy storage system.',
    producerId: 'producer-2',
    producerName: 'HydroGen Corp',
    status: 'Applied',
    grantTotal: null,
    milestones: [
      {
        index: 0,
        description: 'Environmental impact assessment',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      },
      {
        index: 1,
        description: 'Wind turbine installation',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      },
      {
        index: 2,
        description: 'Hydrogen production system setup',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      }
    ],
    contractAddress: null,
    createdAt: '2024-02-01T09:15:00.000Z',
    updatedAt: '2024-02-01T09:15:00.000Z'
  },
  {
    _id: 'project-3',
    name: 'Green Hydrogen Research Lab',
    description: 'Establishment of a research laboratory for developing next-generation hydrogen production technologies.',
    producerId: 'producer-3',
    producerName: 'Clean Energy Innovations',
    status: 'Flagged',
    grantTotal: 800000,
    milestones: [
      {
        index: 0,
        description: 'Lab facility construction',
        amount: 400000,
        verified: true,
        proofUrls: [
          'https://example.com/lab-construction.jpg',
          'https://example.com/construction-permits.pdf'
        ],
        auditorComments: 'Construction completed but some equipment specifications need verification.'
      },
      {
        index: 1,
        description: 'Research equipment procurement',
        amount: 300000,
        verified: false,
        proofUrls: [
          'https://example.com/equipment-invoices.pdf'
        ],
        auditorComments: null
      },
      {
        index: 2,
        description: 'Initial research phase completion',
        amount: 100000,
        verified: false,
        proofUrls: [],
        auditorComments: null
      }
    ],
    contractAddress: '0x2345678901234567890123456789012345678901',
    createdAt: '2024-01-20T11:45:00.000Z',
    updatedAt: '2024-02-15T16:30:00.000Z'
  },
  {
    _id: 'project-4',
    name: 'Industrial Hydrogen Hub',
    description: 'Development of a large-scale hydrogen production and distribution hub for industrial applications.',
    producerId: 'producer-1',
    producerName: 'GreenTech Solutions',
    status: 'Draft',
    grantTotal: null,
    milestones: [
      {
        index: 0,
        description: 'Feasibility study and site selection',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      },
      {
        index: 1,
        description: 'Infrastructure development',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      },
      {
        index: 2,
        description: 'Hub commissioning and testing',
        amount: 0,
        verified: false,
        proofUrls: [],
        auditorComments: null
      }
    ],
    contractAddress: null,
    createdAt: '2024-02-20T08:00:00.000Z',
    updatedAt: '2024-02-20T08:00:00.000Z'
  },
  {
    _id: 'project-5',
    name: 'Coastal Hydrogen Plant',
    description: 'Offshore wind-powered hydrogen production facility with seawater electrolysis.',
    producerId: 'producer-2',
    producerName: 'HydroGen Corp',
    status: 'Rejected',
    grantTotal: null,
    milestones: [
      {
        index: 0,
        description: 'Marine environmental study',
        amount: 0,
        verified: false,
        proofUrls: [
          'https://example.com/marine-study.pdf'
        ],
        auditorComments: 'Environmental study incomplete - insufficient data on marine ecosystem impact.'
      }
    ],
    contractAddress: null,
    createdAt: '2024-01-10T14:20:00.000Z',
    updatedAt: '2024-01-25T10:15:00.000Z'
  },
  {
    _id: 'project-6',
    name: 'Hydrogen Transport Network',
    description: 'Development of hydrogen pipeline infrastructure for regional distribution.',
    producerId: 'producer-3',
    producerName: 'Clean Energy Innovations',
    status: 'Terminated',
    grantTotal: 1200000,
    milestones: [
      {
        index: 0,
        description: 'Pipeline route planning',
        amount: 300000,
        verified: true,
        proofUrls: [
          'https://example.com/route-maps.pdf'
        ],
        auditorComments: 'Route planning approved with modifications.'
      },
      {
        index: 1,
        description: 'Construction permits and approvals',
        amount: 400000,
        verified: false,
        proofUrls: [],
        auditorComments: 'Project terminated due to regulatory changes.'
      }
    ],
    contractAddress: '0x3456789012345678901234567890123456789012',
    createdAt: '2024-01-05T12:30:00.000Z',
    updatedAt: '2024-02-05T15:45:00.000Z'
  }
];

// Mock available subsidies (government-opened projects)
export const mockAvailableSubsidies = [
  {
    _id: 'subsidy-1',
    name: 'Rural Hydrogen Initiative',
    description: 'Government subsidy program for hydrogen projects in rural areas',
    maxGrant: 1500000,
    deadline: '2024-06-30T23:59:59.000Z',
    status: 'open',
    requirements: [
      'Project location must be in designated rural areas',
      'Minimum 10MW production capacity',
      'Environmental compliance certification required'
    ]
  },
  {
    _id: 'subsidy-2',
    name: 'Industrial Decarbonization Fund',
    description: 'Support for hydrogen projects replacing fossil fuels in industrial processes',
    maxGrant: 3000000,
    deadline: '2024-08-15T23:59:59.000Z',
    status: 'open',
    requirements: [
      'Must demonstrate clear fossil fuel replacement',
      'Industrial partnership agreements required',
      'Lifecycle carbon reduction analysis needed'
    ]
  },
  {
    _id: 'subsidy-3',
    name: 'Green Transport Initiative',
    description: 'Funding for hydrogen infrastructure supporting clean transportation',
    maxGrant: 2000000,
    deadline: '2024-07-31T23:59:59.000Z',
    status: 'open',
    requirements: [
      'Focus on transport sector applications',
      'Refueling station integration plan required',
      'Public-private partnership preferred'
    ]
  }
];

// Helper function to generate random IDs
export function generateMockId(): string {
  return 'mock-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to get current timestamp
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}