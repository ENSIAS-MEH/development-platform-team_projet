'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProjectCard } from '@/components/ProjectCard'
import { FormationCard } from '@/components/FormationCard'
import { EmptyState } from '@/components/EmptyState'
import {
  getMyProjects,
  getMyFormations,
  getFormations,
  getAllUsers,
  deleteUser,
} from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [formations, setFormations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    async function loadData() {
      try {
        if (user?.role === 'STUDENT') {
          const [projectsData, formationsData] = await Promise.all([
            getMyProjects().catch(() => []),
            getFormations({ free: true }).catch(() => []),
          ])
          setProjects(projectsData || [])
          setFormations(formationsData || [])
        } else if (user?.role === 'MENTOR') {
          const formationsData = await getMyFormations().catch(() => [])
          setFormations(formationsData || [])
        } else if (user?.role === 'ADMIN') {
          const usersData = await getAllUsers().catch(() => [])
          setUsers(usersData || [])
        }
      } catch {
        console.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user) loadData()
  }, [user, isLoading, router])

  if (isLoading || loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      console.error('Failed to delete user')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>
      </section>

      {/* Student Dashboard */}
      {user.role === 'STUDENT' && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-12">
            {/* My Projects */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Projects</h2>
                <Link href="/projects/create">
                  <Button>New Project</Button>
                </Link>
              </div>

              {projects.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.status}
                        owner={project.owner?.name || 'Unknown'}
                        skills={project.requiredSkills}
                        onClick={() => router.push(`/projects/${project.id}`)}
                      />
                    ))}
                </div>
              ) : (
                <EmptyState
                  title="No projects yet"
                  description="Create your first project and invite collaborators"
                  action={{
                    label: 'Create Project',
                    href: '/projects/create',
                  }}
                />
              )}
            </div>

            {/* Recommended Formations */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recommended Courses</h2>
                <Link href="/formations">
                  <Button variant="outline">Browse All</Button>
                </Link>
              </div>

              {formations.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {formations.slice(0, 6).map((formation) => (
                    <FormationCard
                      key={formation.id}
                      title={formation.title}
                      mentor={formation.mentor?.name || 'Unknown'}
                      price={formation.price}
                      level={formation.level}
                      duration={formation.duration}
                      onClick={() => router.push(`/formations/${formation.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No courses available"
                  description="Check back soon for new learning opportunities"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mentor Dashboard */}
      {user.role === 'MENTOR' && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Formations</h2>
              <Link href="/formations/create">
                <Button>New Formation</Button>
              </Link>
            </div>

            {formations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {formations.map((formation) => (
                    <FormationCard
                      key={formation.id}
                      title={formation.title}
                      mentor={formation.mentor?.name || 'Unknown'}
                      price={formation.price}
                      level={formation.level}
                      duration={formation.duration}
                      onClick={() => router.push(`/formations/${formation.id}`)}
                    />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No formations yet"
                description="Create your first formation and start teaching"
                action={{
                  label: 'Create Formation',
                  href: '/formations/create',
                }}
              />
            )}
          </div>
        </section>
      )}

      {/* Admin Dashboard */}
      {user.role === 'ADMIN' && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-2xl font-bold">User Management</h2>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 text-sm">{u.name}</td>
                        <td className="px-6 py-4 text-sm">{u.email}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {u.role}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
