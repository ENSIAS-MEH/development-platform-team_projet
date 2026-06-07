'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProject } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function CreateProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.role !== 'STUDENT') {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          Only students can create projects
        </p>
        <Link href="/projects" className="mt-4 inline-block">
          <Button variant="outline">Back to projects</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const requiredSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)

      const project = await createProject({
        title,
        description,
        requiredSkills,
      })

      if (!project.id || project.id === 'undefined') {
        throw new Error('Project was created but no id was returned from the API')
      }

      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to projects
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Create a New Project</h1>
          <p className="mt-2 text-muted-foreground">
            Share your project idea and find collaborators
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Project Title
                </label>
                <Input
                  id="title"
                  placeholder="Give your project a clear title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its goals, and what you're looking for in collaborators"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="skills" className="text-sm font-medium">
                  Required Skills (comma-separated)
                </label>
                <Input
                  id="skills"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
                <Link href="/projects">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
