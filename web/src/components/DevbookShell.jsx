import React, {
  useState,
  useCallback,
  useEffect,
} from 'react'

import {
  useDevbook,
  Env,
  DevbookStatus,
} from '@devbookhq/sdk'
import {
  Language,
  Editor as DevbookEditor,
  Output,
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

export default function DevbookShell({
  command: initialCommand,
  autorun = false,
}) {
  const [command, setCommand] = useState(initialCommand)
  const { runCmd, stdout, stderr, status } = useDevbook({ debug: true, env: Env.NextJS })

  const run = useCallback(() => {
    runCmd(command)
  }, [runCmd, command])

  useEffect(() => {
    if (!autorun) return
    if (status !== DevbookStatus.Connected) return
    run()
  }, [autorun, status, run])

  const updateCommand = useCallback(content => {
    setCommand(content)
  }, [])

  return (
    <div className="dbk-editor-wrapper">
      <button className="run-btn" onClick={run}>Run</button>
      <DevbookEditor
        language={Language.sh}
        initialContent={initialCommand}
        onContentChange={updateCommand}
      />
      {(stdout.length > 0 || stderr.length > 0) && (
        <Output
          stdout={stdout}
          stderr={stderr}
        />
      )}
    </div>
  )
}
