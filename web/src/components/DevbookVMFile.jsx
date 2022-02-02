import React, {
  useEffect,
} from 'react'

import {
  useDevbook,
  DevbookStatus,
  Env,
} from '@devbookhq/sdk'

export { Language } from '@devbookhq/ui'

export default function DevbookVMFile({
  filepath,
  code: initialCode,
}) {
  const { fs, status } = useDevbook({ debug: true, env: Env.NextJS })

  useEffect(() => {
    async function init() {
      if (!fs) return
      if (status !== DevbookStatus.Connected) return
      if (!filepath) return

      await fs.write(filepath, initialCode)
    }
    init()
  }, [
    initialCode,
    status,
    fs,
    filepath,
  ])

  return (
    <div />
  )
}
