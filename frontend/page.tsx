'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProjectCard } from '@/components/ProjectCard'
import { FormationCard } from '@/components/FormationCard'
import { EmptyState } from '@/components/EmptyState'
import { getOpenProjects, getFormations } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, formationsData] = await Promise.all([
          getOpenProjects().catch(() => []),
          getFormations({ free: true }).catch(() => []),
        ])
        setProjects(projectsData.slice(0, 6) || [])
        setFormations(formationsData.slice(0, 6) || [])
      } catch {
        console.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold sm:text-5xl">
            Connect, Collaborate, Create
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Join ProjectMatch to collaborate with mentors, work on real projects, and
            learn from industry experts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" variant="secondary">
                Explore Projects
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Open Projects */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-balance text-3xl font-bold">Open Projects</h2>
              <p className="mt-2 text-muted-foreground">
                Find and join exciting projects
              </p>
            </div>
            <Link href="/projects">
              <Button variant="outline">View all</Button>
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
              title="No open projects yet"
              description="Check back soon for new projects to join"
            />
          )}
        </div>
      </section>

      {/* Featured Formations */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-balance text-3xl font-bold">
                Featured Formations
              </h2>
              <p className="mt-2 text-muted-foreground">
                Learn from expert mentors
              </p>
            </div>
            <Link href="/formations">
              <Button variant="outline">View all</Button>
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
              title="No formations available"
              description="Check back soon for new learning opportunities"
            />
          )}
        </div>
      </section>
    </div>
  )
}
