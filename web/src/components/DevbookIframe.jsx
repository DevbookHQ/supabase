import React from 'react'

import { Iframe } from '@devbookhq/ui'
import { useDevbook, Env } from '@devbookhq/sdk'

export default function DevbookIframe({ port }) {
  const { url } = useDevbook({ env: Env.Supabase, port })

  return (
    <Iframe
      url={url}
      height={350}
    />
  )
}
