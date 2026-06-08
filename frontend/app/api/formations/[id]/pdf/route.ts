import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const backendUrl = `${API_BASE_URL}/api/formations/${id}/pdf`

  try {
    const response = await fetch(backendUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: response.status },
      )
    }

    const pdf = await response.arrayBuffer()

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="formation-${id}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load PDF' },
      { status: 502 },
    )
  }
}
