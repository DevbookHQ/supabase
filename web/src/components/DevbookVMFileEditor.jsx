import React, {
  useState,
  useEffect,
  useCallback,
} from 'react'

import {
  useDevbook,
  DevbookStatus,
  Env,
} from '@devbookhq/sdk'
import {
  Editor as DevbookEditor,
  Output,
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

function DevbookVMFileEditor({
  language,
  filepath,
  code: initialCode,
}) {
  const { stdout, stderr, fs, status } = useDevbook({ debug: true, env: Env.NextJS })

  const updateCode = useCallback(async content => {
    try {
      await fs.write(filepath, content)
    } catch { }
  }, [fs])

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
    <div className="dbk-editor-wrapper">
      <DevbookEditor
        filepath={filepath}
        language={language}
        initialContent={initialCode}
        onContentChange={updateCode}
      />
    </div>
  )
}

export default DevbookVMFileEditor
