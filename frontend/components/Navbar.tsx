'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (isLoading) {
    return (
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary">
              ProjectMatch
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            ProjectMatch
          </Link>

          {/* Desktop menu */}
          <div className="hidden gap-1 md:flex md:items-center">
            {user ? (
              <>
                <Link
                  href="/"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Projects
                </Link>
                <Link
                  href="/formations"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Formations
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Profile
                </Link>
                <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Button size="sm" variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/" className="rounded px-3 py-2 text-sm hover:bg-muted">
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Projects
                </Link>
                <Link
                  href="/formations"
                  className="rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Formations
                </Link>
                <Link href="/login" className="ml-4">
                  <Button size="sm">Sign In</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-4 space-y-2 border-t border-border pt-4 md:hidden">
            <Link
              href="/"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Projects
            </Link>
            <Link
              href="/formations"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Formations
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Profile
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" className="block">
                <Button size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
