'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getFormationById, updateFormation } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function EditFormationPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const formationId = params.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [duration, setDuration] = useState('')
  const [level, setLevel] = useState('BEGINNER')
  const [pdf, setPdf] = useState<File | null>(null)
  const [hasExistingPdf, setHasExistingPdf] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!user || user.role !== 'MENTOR') {
      setLoading(false)
      return
    }

    async function loadFormation() {
      try {
        const formation = await getFormationById(formationId)
        if (user!.id !== (formation.mentor?.id ?? formation.mentorId)) {
          setError('You can only edit your own formations')
          return
        }
        setTitle(formation.title)
        setDescription(formation.description)
        setPrice(String(formation.price))
        setDuration(formation.duration)
        setLevel(formation.level)
        setHasExistingPdf(!!formation.pdfUrl)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load formation',
        )
      } finally {
        setLoading(false)
      }
    }

    loadFormation()
  }, [formationId, user, authLoading])

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== 'MENTOR') {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          Only mentors can edit formations
        </p>
        <Link href="/formations" className="mt-4 inline-block">
          <Button variant="outline">Back to formations</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await updateFormation(
        formationId,
        {
          title,
          description,
          price: parseFloat(price) || 0,
          duration,
          level,
        },
        pdf,
      )
      router.push(`/formations/${formationId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update formation')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/formations/${formationId}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to formation
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Edit Formation</h1>
          <p className="mt-2 text-muted-foreground">
            Update course details or replace the PDF
          </p>
        </div>
      </section>

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
                  Course Title
                </label>
                <Input
                  id="title"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price (0 for free)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">
                    Duration
                  </label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium">
                  Level
                </label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="pdf" className="text-sm font-medium">
                  Formation PDF
                </label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  {hasExistingPdf
                    ? 'Leave empty to keep the current PDF, or upload a new one to replace it.'
                    : 'Upload a PDF file for this formation.'}
                </p>
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href={`/formations/${formationId}`}>
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
