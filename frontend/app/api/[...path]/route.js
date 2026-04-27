import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://10.0.4.151:4000'

async function handler(req, { params }) {
  const path = params.path.join('/')
  const url = `${BACKEND_URL}/api/${path}`

  const headers = new Headers(req.headers)
  headers.delete('host')

  let body = null

  // 🔥 Detect JSON vs others
  const contentType = req.headers.get('content-type') || ''

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType.includes('application/json')) {
      const json = await req.json()
      body = JSON.stringify(json)
      headers.set('content-type', 'application/json')
    } else {
      body = await req.arrayBuffer()
    }
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    })

    const responseBody = await response.arrayBuffer()

    return new NextResponse(responseBody, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Proxy error:', error)

    return NextResponse.json(
      { error: 'Proxy failed', details: error.message },
      { status: 500 }
    )
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
}