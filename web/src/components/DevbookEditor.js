import React, {
  useState,
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

export default function Editor({
  initialCode,
  language,
  sql,
  filepath,
}) {
  const [code, setCode] = useState(initialCode)
  const { runCmd, stdout, stderr } = useDevbook({ debug: true, env: Env.Supabase })
  
  function run() {
    const cmd = `psql postgresql://postgres:572570920Vasa@db.axzsxyxaetidbdskvkov.supabase.co -c '${sql}'`
    console.log({ cmd })
    runCmd(cmd)
  }

  function updateCode(content) {
    setCode(content)
  }

  return (
    <div className="dbk-editor-wrapper">
      {sql && <button className="run-btn" onClick={run}>Run</button>}
      <DevbookEditor
        initialCode={initialCode || sql}
        language={language}
        onChange={updateCode}
        filepath={filepath}
      />
      {sql && (stdout.length > 0 || stderr.length > 0) && (
        <Output
          stdout={stdout}
          stderr={stderr}
        />
      )}
    </div>
  )
}
