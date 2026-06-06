# ProjectMatch Frontend - Setup Guide

## Project Overview

This is a complete, production-ready React/Next.js frontend for **ProjectMatch** — a collaborative platform connecting students and mentors to share projects and learn together.

## What's Included

### Pages Implemented
- ✅ **Landing Page** (`/`) - Hero section with featured projects and formations
- ✅ **Authentication** (`/login`, `/register`) - User registration with role selection
- ✅ **Projects** (`/projects`, `/projects/:id`, `/projects/create`) - Browse, view, and create projects
- ✅ **Formations** (`/formations`, `/formations/:id`, `/formations/create`) - Course discovery and management
- ✅ **Dashboard** (`/dashboard`) - Role-based dashboard (Student/Mentor/Admin)
- ✅ **Profile** (`/profile`) - User settings and preferences

### Components Created
- Navbar with responsive mobile menu
- ProjectCard and FormationCard components
- StatusBadge for status/role/level display
- LoadingSpinner for async operations
- EmptyState for no results
- Reusable form inputs and layouts

### Features
- JWT-based authentication with localStorage
- API client wrapper with token management
- Auth context for global user state
- Protected routes with middleware
- Search and filtering across all collections
- Role-based access control (Student/Mentor/Admin)
- Responsive design (mobile-first)
- Dark mode support with design tokens

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Add Required Components
The following shadcn/ui components are already added:
- button, card, input, badge, select, textarea, form

If needed, add more:
```bash
npx shadcn@latest add [component-name]
```

### 3. Start Development Server
```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

### 4. Set Environment Variables
Create `.env.local` (or copy `.env.local.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8082
```

## API Integration

The frontend talks to the Spring Boot API in `../backend/` (default port **8082**). See the root [README.md](../README.md) for the full stack setup.

### Key API Endpoints Expected

**Authentication**
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user

**Projects**
- `GET /api/projects` - List projects with optional filters
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `POST /api/teams/project/:id/join` - Join project team
- `POST /api/teams/project/:id/leave` - Leave project team
- `PATCH /api/projects/:id/status?status=` - Update project status

**Formations (Courses)**
- `GET /api/formations` - List formations
- `POST /api/formations` - Create formation
- `GET /api/formations/:id` - Get formation details
- `PUT /api/formations/:id` - Update formation
- `DELETE /api/formations/:id` - Delete formation

**Users**
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `GET /api/users` - List all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Project Structure

```
/app
├── page.tsx                     # Landing page
├── layout.tsx                   # Root layout
├── login/page.tsx
├── register/page.tsx
├── dashboard/page.tsx
├── profile/page.tsx
├── projects/
│   ├── page.tsx
│   ├── [id]/page.tsx
│   └── create/page.tsx
└── formations/
    ├── page.tsx
    ├── [id]/page.tsx
    └── create/page.tsx

/components
├── Navbar.tsx
├── ProjectCard.tsx
├── FormationCard.tsx
├── StatusBadge.tsx
├── LoadingSpinner.tsx
├── EmptyState.tsx
└── ui/                          # shadcn/ui components

/lib
├── api.ts                       # API client wrapper
├── auth-context.tsx             # Auth provider
└── utils.ts                     # Utilities

/middleware.ts                   # Route protection
```

## Key Files to Understand

### `/lib/api.ts`
- HTTP client wrapper (`apiFetch`)
- JWT token management (`getToken`, `setToken`, `removeToken`)
- Typed API functions for all endpoints
- Error handling (401 redirects to login)

### `/lib/auth-context.tsx`
- Global auth state management
- `useAuth` hook for consuming auth state
- User object with id, name, email, role, etc.

### `/middleware.ts`
- Protects routes requiring authentication
- Redirects unauthorized users to /login

### `/components/Navbar.tsx`
- Responsive navigation with mobile menu
- Role-based link visibility
- Logout functionality

## Design System

### Colors
- **Primary (Violet)**: `#6C3FC5` - Main brand color
- **Background (Dark Navy)**: `#0F172A` - Dark mode background
- Uses semantic design tokens defined in `globals.css`

### Typography
- Sans-serif: Geist
- Mono: Geist Mono

### Layout
- Mobile-first responsive design
- Flexbox for layouts
- Grid for card arrangements (1-3 columns)

## Development Workflow

### Adding a New Page
1. Create folder in `/app` (e.g., `/app/new-page`)
2. Add `page.tsx` file
3. Import components and use API utilities
4. If protected, add to middleware routes

### Adding a New Component
1. Create file in `/components` (PascalCase)
2. Use shadcn/ui components as base
3. Add props and TypeScript types
4. Import in pages where needed

### Adding API Integration
1. Add function to `/lib/api.ts`
2. Use `apiFetch` wrapper (handles auth headers)
3. Define type interfaces for requests/responses
4. Use in components with error handling

### Testing Locally
1. Start dev server: `pnpm dev`
2. Use browser DevTools for debugging
3. Check Network tab for API calls
4. Use `console.log("[v0] ...")` for tracing

## Common Tasks

### Add new shadcn component
```bash
npx shadcn@latest add [component-name]
```

### Build for production
```bash
pnpm run build
pnpm start
```

### Run type checks
```bash
pnpm tsc --noEmit
```

### Format code
```bash
pnpm run format
```

## Deployment

### To Vercel
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel auto-deploys on git push

### To Other Platforms
- Build: `pnpm run build`
- Start: `pnpm start`
- Requires Node.js 18+

## Troubleshooting

### "Cannot find module" errors
- Ensure dependency is installed: `pnpm add [package]`
- Check import paths (use `@/` aliases)
- Restart dev server

### API calls return 401
- Check token is being set after login
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running and accessible

### Styles not applying
- Verify Tailwind classes are used
- Check `globals.css` for design tokens
- Restart dev server after CSS changes

### Navigation not working
- Ensure routes exist in `/app` folder
- Check links use Next.js `Link` component
- Verify middleware isn't blocking routes

## Next Steps

1. **Connect to Backend**: Run `cd ../backend && mvn spring-boot:run` (port 8082)
2. **Create Test Data**: Populate database with sample projects/formations for testing
3. **Customize Branding**: Update logo, colors, and content to match your brand
4. **Add Features**: Implement additional features like real-time notifications, messaging, payments
5. **Deploy**: Push to production using Vercel or your preferred platform

## Support & Questions

Refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Built with v0** - A modern frontend for a collaborative education platform.
