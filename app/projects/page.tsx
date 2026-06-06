'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProjectCard } from '@/components/ProjectCard'
import { EmptyState } from '@/components/EmptyState'
import { getProjects } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function ProjectsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')

  const loadProjects = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (status) filters.status = status
      if (keyword) filters.keyword = keyword
      const data = await getProjects(filters).catch(() => [])
      setProjects(data || [])
    } catch {
      console.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProjects()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Find and join exciting projects with other students
          </p>

          {isAuthenticated && (
            <Link href="/projects/create" className="mt-6 inline-block">
              <Button>Create Project</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <form onSubmit={handleSearch} className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                placeholder="Search projects..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : projects.length > 0 ? (
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
              title="No projects found"
              description="Try adjusting your search or filters"
            />
          )}
        </div>
      </section>
    </div>
  )
}
