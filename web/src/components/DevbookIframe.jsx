import React from 'react'

import { Iframe } from '@devbookhq/ui'
import { useDevbook, Env } from '@devbookhq/sdk'

function DevbookIframe({ port, env }) {
  const { url } = useDevbook({ env, port })

  return (
    <Iframe
      url={url}
      height={350}
    />
  )
}

export default DevbookIframe
