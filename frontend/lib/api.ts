// API client aligned with the Spring Boot backend (backend/)

export interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN'
  bio?: string
  avatar?: string
  skills?: string[]
  createdAt?: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  requiredSkills: string[]
  ownerId: string
  owner?: User
  teamMembers?: User[]
  createdAt: string
  updatedAt?: string
}

export interface Formation {
  id: string
  title: string
  description: string
  price: number
  duration: string
  level: string
  mentorId: string
  mentor?: User
  pdfUrl?: string
  createdAt?: string
}

export interface Team {
  id: string
  projectId: string
  members: User[]
}

export interface AuthResponse {
  token: string
  user: User
}

const TOKEN_KEY = 'projectmatch_token'
const AUTH_COOKIE = 'token'
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'

// --- Token & cookie (cookie used by middleware for route protection) ---

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}

// --- Mappers (backend uses numeric ids, comma-separated skills, flat auth response) ---

function parseSkills(skills: string | string[] | null | undefined): string[] {
  if (!skills) return []
  if (Array.isArray(skills)) return skills
  return skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function mapUser(raw: Record<string, unknown>): User {
  const skills = raw.skills as string | string[] | undefined
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    role: raw.role as User['role'],
    bio: (raw.bio as string) || undefined,
    avatar: (raw.avatarUrl as string) || (raw.avatar as string) || undefined,
    skills: parseSkills(skills),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  }
}

function mapProject(raw: Record<string, unknown>, teamMembers?: User[]): Project {
  const owner = raw.owner as Record<string, unknown> | undefined
  return {
    id: String(raw.id),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    status: raw.status as Project['status'],
    requiredSkills: parseSkills(raw.requiredSkills as string),
    ownerId: owner
      ? String(owner.id)
      : raw.ownerId != null
        ? String(raw.ownerId)
        : '',
    owner: owner ? mapUser(owner) : undefined,
    teamMembers,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  }
}

function mapFormation(raw: Record<string, unknown>): Formation {
  const mentor = raw.mentor as Record<string, unknown> | undefined
  return {
    id: String(raw.id),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    price: Number(raw.price ?? 0),
    duration: String(raw.duration ?? ''),
    level: String(raw.level ?? ''),
    mentorId: mentor
      ? String(mentor.id)
      : raw.mentorId != null
        ? String(raw.mentorId)
        : '',
    mentor: mentor ? mapUser(mentor) : undefined,
    pdfUrl: raw.pdfUrl ? String(raw.pdfUrl) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  }
}

function mapAuthResponse(raw: Record<string, unknown>): AuthResponse {
  const token = String(raw.token ?? '')
  const user = mapUser({
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    ...(raw.user as Record<string, unknown> | undefined),
  })
  return { token, user }
}

function mapTeam(raw: Record<string, unknown>): Team {
  const members = (raw.members as Record<string, unknown>[] | undefined) ?? []
  const project = raw.project as Record<string, unknown> | undefined
  return {
    id: String(raw.id ?? ''),
    projectId: project ? String(project.id) : String(raw.projectId ?? ''),
    members: members.map(mapUser),
  }
}

// --- HTTP ---

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiFetch(
  endpoint: string,
  options: ApiOptions = {},
): Promise<any> {
  const { skipAuth = false, ...fetchOptions } = options
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${path}`

  const headers = new Headers(fetchOptions.headers || {})
  if (
    !headers.has('Content-Type') &&
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json')
  }

  if (!skipAuth) {
    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    const isAuthEndpoint = path.startsWith('/api/auth/')
    if (!isAuthEndpoint && getToken()) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      (data as { error?: string; message?: string }).error ||
      (data as { error?: string; message?: string }).message ||
      `API error: ${response.status}`
    throw new Error(message)
  }

  return data
}

// --- Auth ---

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const raw = await apiFetch('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  })
  const response = mapAuthResponse(raw)
  setToken(response.token)
  return response
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: 'STUDENT' | 'MENTOR',
): Promise<AuthResponse> {
  const raw = await apiFetch('/api/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ name, email, password, role }),
  })
  const response = mapAuthResponse(raw)
  setToken(response.token)
  return response
}

// --- Projects ---

export async function getOpenProjects(): Promise<Project[]> {
  const list = await apiFetch('/api/projects/open', { skipAuth: true })
  return (list as Record<string, unknown>[]).map((p) => mapProject(p))
}

export async function getMyProjects(): Promise<Project[]> {
  const list = await apiFetch('/api/projects/mine')
  return (list as Record<string, unknown>[]).map((p) => mapProject(p))
}

export async function getProjects(filters?: {
  status?: string
  keyword?: string
}): Promise<Project[]> {
  const token = getToken()

  if (filters?.keyword && token) {
    const list = await apiFetch(
      `/api/projects/search?keyword=${encodeURIComponent(filters.keyword)}`,
    )
    let projects = (list as Record<string, unknown>[]).map((p) => mapProject(p))
    if (filters.status) {
      projects = projects.filter((p) => p.status === filters.status)
    }
    return projects
  }

  if (!token) {
    let projects = await getOpenProjects()
    if (filters?.status) {
      projects = projects.filter((p) => p.status === filters.status)
    }
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase()
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw),
      )
    }
    return projects
  }

  const list = await apiFetch('/api/projects')
  let projects = (list as Record<string, unknown>[]).map((p) => mapProject(p))
  if (filters?.status) {
    projects = projects.filter((p) => p.status === filters.status)
  }
  if (filters?.keyword) {
    const kw = filters.keyword.toLowerCase()
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw),
    )
  }
  return projects
}

export async function getProjectById(id: string): Promise<Project> {
  const raw = await apiFetch(`/api/projects/${id}`, { skipAuth: true })
  return mapProject(raw as Record<string, unknown>)
}

export async function getProjectWithTeam(id: string): Promise<Project> {
  const project = await getProjectById(id)
  if (!getToken()) return project

  try {
    const team = await getTeamByProject(id)
    return { ...project, teamMembers: team.members }
  } catch {
    return project
  }
}

export async function createProject(data: {
  title: string
  description: string
  requiredSkills?: string[] | string
}): Promise<Project> {
  const skills =
    typeof data.requiredSkills === 'string'
      ? data.requiredSkills
      : (data.requiredSkills ?? []).join(', ')

  const raw = await apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      requiredSkills: skills,
    }),
  })
  return mapProject(raw as Record<string, unknown>)
}

export async function updateProjectStatus(
  id: string,
  status: string,
): Promise<Project> {
  const raw = await apiFetch(
    `/api/projects/${id}/status?status=${encodeURIComponent(status)}`,
    { method: 'PATCH' },
  )
  return mapProject(raw as Record<string, unknown>)
}

export async function updateProject(
  id: string,
  data: {
    title: string
    description: string
    requiredSkills?: string[] | string
  },
): Promise<Project> {
  const skills =
    typeof data.requiredSkills === 'string'
      ? data.requiredSkills
      : (data.requiredSkills ?? []).join(', ')

  const raw = await apiFetch(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      requiredSkills: skills,
    }),
  })
  return mapProject(raw as Record<string, unknown>)
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch(`/api/projects/${id}`, { method: 'DELETE' })
}

// --- Teams ---

export async function getTeamByProject(projectId: string): Promise<Team> {
  const raw = await apiFetch(`/api/teams/project/${projectId}`)
  return mapTeam(raw as Record<string, unknown>)
}

export async function joinTeam(projectId: string): Promise<Team> {
  const raw = await apiFetch(`/api/teams/project/${projectId}/join`, {
    method: 'POST',
  })
  return mapTeam(raw as Record<string, unknown>)
}

export async function leaveTeam(projectId: string): Promise<void> {
  await apiFetch(`/api/teams/project/${projectId}/leave`, {
    method: 'POST',
  })
}

// --- Formations ---

export async function getMyFormations(): Promise<Formation[]> {
  const list = await apiFetch('/api/formations/mine')
  return (list as Record<string, unknown>[]).map(mapFormation)
}

export async function getFormations(filters?: {
  free?: boolean
  keyword?: string
}): Promise<Formation[]> {
  const endpoint = filters?.free ? '/api/formations/free' : '/api/formations'
  const list = await apiFetch(endpoint, { skipAuth: true })
  let formations = (list as Record<string, unknown>[]).map(mapFormation)
  if (filters?.keyword) {
    const kw = filters.keyword.toLowerCase()
    formations = formations.filter(
      (f) =>
        f.title.toLowerCase().includes(kw) ||
        f.description.toLowerCase().includes(kw),
    )
  }
  return formations
}

export async function getFormationById(id: string): Promise<Formation> {
  const raw = await apiFetch(`/api/formations/${id}`, { skipAuth: true })
  return mapFormation(raw as Record<string, unknown>)
}

export async function createFormation(
  data: {
    title: string
    description: string
    price: number
    duration: string
    level: string
  },
  pdf: File,
): Promise<Formation> {
  const form = new FormData()
  form.append(
    'formation',
    new Blob([JSON.stringify(data)], { type: 'application/json' }),
  )
  form.append('pdf', pdf)

  const raw = await apiFetch('/api/formations', {
    method: 'POST',
    body: form,
  })
  return mapFormation(raw as Record<string, unknown>)
}

/** Same-origin URL so PDFs can be embedded in the page (avoids cross-origin iframe blocking). */
export function getFormationPdfUrl(formation: Formation): string | null {
  if (!formation.pdfUrl && !formation.id) return null
  return `/api/formations/${formation.id}/pdf`
}

export async function updateFormation(
  id: string,
  data: {
    title: string
    description: string
    price: number
    duration: string
    level: string
  },
  pdf?: File | null,
): Promise<Formation> {
  const form = new FormData()
  form.append(
    'formation',
    new Blob([JSON.stringify(data)], { type: 'application/json' }),
  )
  if (pdf) {
    form.append('pdf', pdf)
  }

  const raw = await apiFetch(`/api/formations/${id}`, {
    method: 'PUT',
    body: form,
  })
  return mapFormation(raw as Record<string, unknown>)
}

export async function deleteFormation(id: string): Promise<void> {
  await apiFetch(`/api/formations/${id}`, { method: 'DELETE' })
}

// --- Users ---

export async function getCurrentUserData(): Promise<User> {
  const raw = await apiFetch('/api/users/me')
  return mapUser(raw as Record<string, unknown>)
}

export async function updateUserProfile(
  data: Partial<User>,
): Promise<User> {
  const raw = await apiFetch('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      bio: data.bio,
      skills: Array.isArray(data.skills)
        ? data.skills.join(', ')
        : data.skills,
      avatarUrl: data.avatar,
    }),
  })
  return mapUser(raw as Record<string, unknown>)
}

export async function getAllUsers(): Promise<User[]> {
  const list = await apiFetch('/api/users')
  return (list as Record<string, unknown>[]).map(mapUser)
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
}

// Legacy helper — prefer getCurrentUserData()
export function getCurrentUser(): User | null {
  return null
}
