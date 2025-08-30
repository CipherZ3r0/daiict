# Green Hydrogen Subsidy Platform

A full-stack blockchain-based platform for managing green hydrogen project subsidies, milestone tracking, and verification processes.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20.x
- **Package Manager**: npm 10.x
- **Styling**: Inline CSS (no external frameworks)
- **Backend**: Next.js API Routes
- **Blockchain**: Ethereum/Polygon (placeholder integration)

## 📁 Project Structure

```
/green-hydrogen-platform
│
├── /src
│   ├── /app
│   │   ├── /dashboard              # Dashboard page for all roles
│   │   │   └── page.tsx
│   │   ├── /login                  # Login page (name + role selection)
│   │   │   └── page.tsx
│   │   ├── /api                    # Backend API routes
│   │   │   ├── /projects
│   │   │   │   └── route.ts        # CRUD projects
│   │   │   └── /milestones
│   │   │       └── route.ts        # Verify/update milestones
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   │
│   ├── /components                 # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MilestoneCard.tsx
│   │   ├── RoleBasedDashboard.tsx
│   │   └── WalletConnectButton.tsx
│   │
│   ├── /lib                        # Utilities and constants
│   │   ├── blockchain.ts           # Blockchain integration placeholders
│   │   └── constants.ts            # App constants and types
│   │
│   └── /styles
│       └── globals.css             # Global CSS reset and base styles
│
├── /public                         # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.local
└── README.md
```

## 🎯 Features

### 🏭 **Producer Role**
- Create new green hydrogen projects
- Define project milestones with subsidy amounts
- Track milestone progress and verification status
- View project completion rates and subsidy releases

### 🏛️ **Government Role**
- Monitor all projects across the platform
- View comprehensive project statistics
- Oversee subsidy distribution and compliance
- Access detailed project and milestone reports

### 🔍 **Auditor Role**
- Review and verify project milestones
- Approve or reject milestone completions
- Trigger subsidy fund releases upon verification
- Track verification history and audit trails

### 🔗 **Blockchain Integration** (Placeholder)
- Smart contract integration for subsidy management
- Automated fund release upon milestone verification
- Immutable audit trails for all transactions
- Web3 wallet connection for secure authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- npm 10.x

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd green-hydrogen-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   NEXT_PUBLIC_BLOCKCHAIN_NETWORK=polygon-mumbai
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_APP_NAME="Green Hydrogen Subsidy Platform"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The platform uses a simplified authentication system for development:

1. **Login Process**: Users enter their name and select a role (Producer, Government, Auditor)
2. **Role-based Access**: Dashboard content changes based on the selected role
3. **No Password Required**: Simplified for demonstration purposes

### Test Users

You can log in with any name and select from these roles:
- **Producer**: Create and manage hydrogen projects
- **Government**: View all projects and oversee operations  
- **Auditor**: Verify milestones and approve subsidy releases

## 📊 Sample Data

The platform includes sample projects for demonstration:

### Project 1: Green Hydrogen Production Facility
- **Producer**: John Smith
- **Subsidy**: $2,500,000
- **Status**: In Progress
- **Milestones**: 3 (1 verified, 2 pending)

### Project 2: Hydrogen Transport Infrastructure  
- **Producer**: Sarah Davis
- **Subsidy**: $1,800,000
- **Status**: Submitted
- **Milestones**: 3 (all pending)

## 🔗 API Endpoints

### Projects API (`/api/projects`)

- **GET**: Retrieve all projects
  ```bash
  curl http://localhost:3000/api/projects
  ```

- **POST**: Create a new project
  ```bash
  curl -X POST http://localhost:3000/api/projects \
    -H "Content-Type: application/json" \
    -d '{"name":"New Project","description":"Project description","producerName":"John Doe","totalSubsidy":1000000,"milestones":[...]}'
  ```

- **PUT**: Update an existing project
  ```bash
  curl -X PUT http://localhost:3000/api/projects \
    -H "Content-Type: application/json" \
    -d '{"projectId":"project-1","status":"approved"}'
  ```

### Milestones API (`/api/milestones`)

- **GET**: Retrieve milestones
  ```bash
  curl http://localhost:3000/api/milestones?status=pending
  ```

- **PUT**: Update milestone verification status
  ```bash
  curl -X PUT http://localhost:3000/api/milestones \
    -H "Content-Type: application/json" \
    -d '{"projectId":"project-1","milestoneId":"milestone-1","status":"verified","verifiedBy":"Alice Johnson"}'
  ```

## 🎨 Styling

The application uses inline CSS with a consistent design system:

- **Primary Color**: Green (#16a34a)
- **Background**: Light green (#f0fdf4)
- **Typography**: System fonts with proper hierarchy
- **Components**: Card-based design with subtle shadows
- **Responsive**: Mobile-first responsive design

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### File Structure Guidelines

- **Components**: Reusable UI components in `/src/components/`
- **Pages**: Next.js pages in `/src/app/`
- **API Routes**: Backend logic in `/src/app/api/`
- **Utilities**: Helper functions and constants in `/src/lib/`
- **Styles**: Global styles in `/src/styles/`

## 🔮 Blockchain Integration

The platform includes placeholder functions for blockchain integration:

### Smart Contract Functions
- `connectWallet()` - Connect Web3 wallet
- `getUserBalance()` - Get user's token balance  
- `releaseFunds()` - Release subsidy funds
- `verifyMilestoneOnChain()` - Record milestone verification

### Implementation Notes
- Replace placeholders in `/src/lib/blockchain.ts`
- Add Web3 provider (MetaMask, WalletConnect, etc.)
- Deploy smart contracts for subsidy management
- Implement proper error handling and transaction monitoring

## 📱 Usage Guide

### For Producers
1. Log in and select "Producer" role
2. Click "New Project" to create a project
3. Fill in project details and define milestones
4. Track progress on the dashboard
5. View milestone verification status

### For Government Officials
1. Log in and select "Government" role
2. View all projects and statistics
3. Monitor subsidy distribution
4. Track platform-wide progress

### For Auditors
1. Log in and select "Auditor" role
2. Review projects requiring verification
3. Click "View Milestones" on projects
4. Verify or reject individual milestones
5. Track verification history

## 🚀 Production Deployment

### Prerequisites
- Database setup (MongoDB, PostgreSQL, etc.)
- Blockchain network configuration
- Environment variable configuration
- SSL certificates for HTTPS

### Deployment Steps
1. **Database Migration**: Replace in-memory storage with proper database
2. **Authentication**: Implement proper user authentication and authorization
3. **Blockchain Integration**: Deploy smart contracts and integrate Web3 functionality
4. **Environment Setup**: Configure production environment variables
5. **Build and Deploy**: Build production bundle and deploy to hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs/` folder
- Review the API documentation

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.