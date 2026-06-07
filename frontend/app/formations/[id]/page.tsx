'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { StatusBadge } from '@/components/StatusBadge'
import { getFormationById, deleteFormation } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function FormationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const formationId = params.id as string

  const [formation, setFormation] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const isOwner = user && formation && user.id === formation.mentorId

  useEffect(() => {
    async function loadFormation() {
      try {
        const data = await getFormationById(formationId)
        setFormation(data)
      } catch {
        console.error('Failed to load formation')
      } finally {
        setLoading(false)
      }
    }

    if (formationId) loadFormation()
  }, [formationId])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this formation?')) return

    setDeleting(true)
    try {
      await deleteFormation(formationId)
      router.push('/formations')
    } catch (err) {
      console.error('Failed to delete formation')
      setDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!formation) {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Formation not found</h1>
        <Link href="/formations" className="mt-4 inline-block">
          <Button variant="outline">Back to formations</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/formations" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to formations
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{formation.title}</h1>
              <p className="mt-2 text-muted-foreground">
                by {formation.mentor?.name || 'Unknown'}
              </p>
            </div>
            <StatusBadge status={formation.level} />
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
                <h2 className="text-lg font-semibold">About this course</h2>
                <p className="mt-4 text-muted-foreground">
                  {formation.description}
                </p>
              </Card>

              {/* Modules */}
              {formation.modules && formation.modules.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <div className="mt-4 space-y-3">
                    {formation.modules.map((module: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
                          {idx + 1}
                        </div>
                        <span>{module}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold">Course Details</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-2 font-semibold">
                      {formation.price === 0 ? 'Free' : `$${formation.price}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level:</span>
                    <span className="ml-2 font-semibold">{formation.level}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-semibold">
                      {formation.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mentor:</span>
                    <span className="ml-2 font-semibold">
                      {formation.mentor?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </Card>

              {isOwner && (
                <Card className="space-y-3 p-6">
                  <Link href={`/formations/${formationId}/edit`}>
                    <Button className="w-full" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
