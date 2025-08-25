'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [status, setStatus] = useState('checking...')
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    fetch('/api/lx/movies?limit=1')
      .then(r => r.json())
      .then(d => { setStatus('OK'); setPayload(d) })
      .catch(e => { setStatus('ERROR'); setPayload(String(e)) })
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>API debug</h1>
      <p>Status: {status}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(payload, null, 2)}</pre>
    </div>
  )
}
