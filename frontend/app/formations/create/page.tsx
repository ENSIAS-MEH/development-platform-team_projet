'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { createFormation } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function CreateFormationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [duration, setDuration] = useState('')
  const [level, setLevel] = useState('BEGINNER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.role !== 'MENTOR') {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          Only mentors can create formations
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
    setLoading(true)

    try {
      const formation = await createFormation({
        title,
        description,
        price: parseFloat(price) || 0,
        duration,
        level,
      })

      router.push(`/formations/${formation.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create formation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/formations" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to formations
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Create a New Formation</h1>
          <p className="mt-2 text-muted-foreground">
            Share your expertise and teach others
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
                  Course Title
                </label>
                <Input
                  id="title"
                  placeholder="Give your course a clear title"
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
                  placeholder="Describe what students will learn"
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
                    placeholder="0"
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
                    placeholder="e.g., 4 weeks, 8 hours"
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

              <div className="flex gap-3 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Formation'}
                </Button>
                <Link href="/formations">
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
