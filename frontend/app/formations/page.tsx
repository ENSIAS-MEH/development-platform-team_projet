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
import { FormationCard } from '@/components/FormationCard'
import { EmptyState } from '@/components/EmptyState'
import { getFormations } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function FormationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [showFree, setShowFree] = useState(true)

  const loadFormations = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (keyword) filters.keyword = keyword
      if (showFree) filters.free = true
      const data = await getFormations(filters).catch(() => [])
      setFormations(data || [])
    } catch {
      console.error('Failed to load formations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFormations()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadFormations()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Formations & Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Learn from expert mentors through structured courses
          </p>

          {isAuthenticated && user?.role === 'MENTOR' && (
            <Link href="/formations/create" className="mt-6 inline-block">
              <Button>Create Formation</Button>
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
                placeholder="Search formations..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Select
                value={showFree ? 'free' : 'all'}
                onValueChange={(v) => setShowFree(v === 'free')}
              >
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="free">Free only</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : formations.length > 0 ? (
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
              title="No formations found"
              description="Try adjusting your search or filters"
            />
          )}
        </div>
      </section>
    </div>
  )
}
