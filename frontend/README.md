# ProjectMatch Frontend

A modern, full-featured React/Next.js frontend for the ProjectMatch collaborative platform connecting students and mentors to share projects and learn together.

## Overview

ProjectMatch is a comprehensive platform where:
- **Students** can create projects, find collaborators, and enroll in mentor-led courses
- **Mentors** can create formations (courses) and manage student learning
- **Admins** can manage users and moderate the platform

## Tech Stack

- **Framework**: Next.js 16.2.6 with React 19
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: shadcn/ui
- **Authentication**: JWT-based (stored in localStorage)
- **HTTP Client**: Fetch API with custom wrapper
- **Routing**: Next.js file-based routing (App Router)

## Features Implemented

### Authentication
- User registration with role selection (Student/Mentor/Admin)
- Email/password login
- JWT token management
- Protected routes middleware

### Projects
- Browse and search open projects
- View project details with team members
- Create new projects (students only)
- Join/leave project teams
- Change project status (owner only)

### Formations (Courses)
- Browse and filter courses by level and price
- View formation details with course content
- Create new formations (mentors only)
- Delete formations (owner only)

### Dashboard
- **Student Dashboard**: View my projects and recommended courses
- **Mentor Dashboard**: Manage my formations with student counts
- **Admin Dashboard**: User management table with delete functionality

### User Profile
- Edit personal information
- Manage skills and bio
- Update avatar URL
- View and manage profile settings

### UI Components
- Responsive navigation bar with role-based links
- Loading spinners for async operations
- Empty states with actionable CTAs
- Status badges with color-coded labels
- Project and Formation cards with hover effects
- Error handling and success notifications

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with auth provider
│   ├── globals.css              # Global styles with design tokens
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── dashboard/page.tsx       # Role-based dashboard
│   ├── profile/page.tsx         # User profile settings
│   ├── projects/
│   │   ├── page.tsx             # Projects listing
│   │   ├── [id]/page.tsx        # Project detail
│   │   └── create/page.tsx      # Create project form
│   └── formations/
│       ├── page.tsx             # Formations listing
│       ├── [id]/page.tsx        # Formation detail
│       └── create/page.tsx      # Create formation form
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── ProjectCard.tsx          # Project card component
│   ├── FormationCard.tsx        # Formation card component
│   ├── StatusBadge.tsx          # Status badge component
│   ├── LoadingSpinner.tsx       # Loading spinners
│   ├── EmptyState.tsx           # Empty state component
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── api.ts                   # API client wrapper with helpers
│   ├── auth-context.tsx         # Auth context provider
│   └── utils.ts                 # Utility functions
├── middleware.ts                # Route protection middleware
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies
```

## Design System

### Colors
- **Primary**: Deep Violet (#6C3FC5) - Main brand color
- **Background**: Dark Navy (#0F172A) - Dark mode background
- **Accents**: Purple tones for interactive elements
- **Status Badges**:
  - OPEN/STUDENT: Green
  - IN_PROGRESS/INTERMEDIATE: Amber
  - CLOSED/ADMIN/ADVANCED: Red

### Typography
- **Headings**: Geist font
- **Body**: Geist Sans
- **Mono**: Geist Mono

### Responsive Design
- Mobile-first approach
- Fluid grid layouts (1-3 columns)
- Hamburger menu for mobile navigation

## API Integration

The frontend communicates with a Java/Spring Boot backend at `http://localhost:8080`.

### Key Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project detail
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/teams/join` - Join team
- `POST /api/projects/:id/teams/leave` - Leave team
- `GET /api/formations` - List formations
- `POST /api/formations` - Create formation
- `GET /api/formations/:id` - Get formation detail
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `GET /api/users` - List all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Add required shadcn/ui components
npx shadcn@latest add input button card badge form select textarea

# Start dev server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Building for Production

```bash
# Build optimized production bundle
pnpm run build

# Start production server
pnpm start
```

## State Management

The app uses:
- **React Context** for global auth state (`AuthProvider`)
- **Component State** (useState) for local form and UI state
- **Custom Hooks** (useAuth) for accessing auth context

## Error Handling

- API errors are caught and displayed to users
- 401 errors trigger redirect to login
- Form validation errors are shown inline
- Network failures display user-friendly messages

## Future Enhancements

- Real-time notifications with WebSockets
- Team chat and messaging
- File uploads for project attachments
- Email notifications
- Advanced search and filtering
- User ratings and reviews
- Payment integration for paid courses
- Course progress tracking
- Certificate generation

## Development Tips

### Adding New Pages
1. Create new folder in `/app`
2. Add `page.tsx` file
3. Use shared components and API utilities
4. Import `useAuth` for protected pages

### Adding New Components
1. Create in `/components`
2. Export from component file
3. Use shadcn/ui for consistency
4. Follow naming conventions (PascalCase)

### Debugging
- Use browser DevTools for client-side debugging
- Check server logs for API errors
- Use `console.log` with `[v0]` prefix for tracking
- Test API calls with curl or Postman

## Deployment

The app is ready to deploy to Vercel:

```bash
# Create a new project on Vercel connected to your Git repo
# Set NEXT_PUBLIC_API_URL environment variable
# Deploy from Git
```

Or deploy to other platforms supporting Next.js apps (AWS, GCP, Azure, etc.).

## License

This project is built as part of the v0 platform.
