import React, {
  useState,
  useCallback,
} from 'react'

import {
  useDevbook,
  Env,
} from '@devbookhq/sdk'
import {
  Language,
  Editor as DevbookEditor,
  Output,
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

export default function DevbookShell({
  command: initialCommand,
}) {
  const [command, setCommand] = useState(initialCommand)
  const { runCmd, stdout, stderr } = useDevbook({ debug: true, env: Env.NextJS })

  function run() {
    runCmd(command)
  }

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
