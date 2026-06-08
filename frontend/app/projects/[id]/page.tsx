'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { StatusBadge } from '@/components/StatusBadge'
import {
  getProjectWithTeam,
  updateProjectStatus,
  joinTeam,
  leaveTeam,
} from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const projectId = params.id as string

  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const isOwner =
    user &&
    project &&
    user.id === (project.owner?.id ?? project.ownerId)

  useEffect(() => {
    async function loadProject() {
      if (!projectId || projectId === 'undefined' || projectId === 'null') {
        setLoading(false)
        return
      }
      try {
        const data = await getProjectWithTeam(projectId)
        setProject(data)
        setNewStatus(data.status)
      } catch (err) {
        console.error('Failed to load project', err)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const handleStatusChange = async (newVal: string) => {
    setNewStatus(newVal)
    setUpdating(true)

    try {
      const updated = await updateProjectStatus(projectId, newVal)
      setProject((prev: any) => ({ ...prev, ...updated }))
    } catch (err) {
      console.error('Failed to update status')
      setNewStatus(project.status)
    } finally {
      setUpdating(false)
    }
  }

  const isTeamMember = project?.teamMembers?.some(
    (m: any) => m.id === user?.id,
  )

  const handleJoinTeam = async () => {
    setJoinLoading(true)
    try {
      const team = await joinTeam(projectId)
      setProject((prev: any) => ({
        ...prev,
        teamMembers: [...(prev.teamMembers || []), user],
      }))
    } catch (err) {
      console.error('Failed to join team')
    } finally {
      setJoinLoading(false)
    }
  }

  const handleLeaveTeam = async () => {
    setJoinLoading(true)
    try {
      await leaveTeam(projectId)
      setProject((prev: any) => ({
        ...prev,
        teamMembers: (prev.teamMembers || []).filter(
          (m: any) => m.id !== user?.id,
        ),
      }))
    } catch (err) {
      console.error('Failed to leave team')
    } finally {
      setJoinLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!project) {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link href="/projects" className="mt-4 inline-block">
          <Button variant="outline">Back to projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to projects
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="mt-2 text-muted-foreground">
                by {project.owner?.name || 'Unknown'}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-4 text-muted-foreground">
                  {project.description}
                </p>
              </Card>

              {/* Required Skills */}
              {Array.isArray(project.requiredSkills) &&
                project.requiredSkills.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold">Required Skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <div className="mt-4 space-y-3">
                    {project.teamMembers.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg bg-muted p-3"
                      >
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {isOwner && (
                <Card className="p-6">
                  <h3 className="font-semibold">Manage Project</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={newStatus}
                        onValueChange={handleStatusChange}
                        disabled={updating}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Link href={`/projects/${projectId}/edit`}>
                      <Button variant="outline" className="w-full">
                        Edit Project
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}

              {user && !isOwner && (
                <Card className="p-6">
                  {isTeamMember ? (
                    <Button
                      variant="outline"
                      onClick={handleLeaveTeam}
                      disabled={joinLoading}
                      className="w-full"
                    >
                      {joinLoading ? 'Leaving...' : 'Leave Team'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoinTeam}
                      disabled={joinLoading || project.status !== 'OPEN'}
                      className="w-full"
                    >
                      {joinLoading ? 'Joining...' : 'Join Team'}
                    </Button>
                  )}
                </Card>
              )}

              <Card className="p-6">
                <h3 className="font-semibold">Project Info</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">{project.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 font-medium">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="ml-2 font-medium">
                      {project.teamMembers?.length || 0} members
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
