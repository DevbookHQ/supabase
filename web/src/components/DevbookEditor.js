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

export default function Editor({
  initialCode,
  language,
  initialSQL,
  filepath,
}) {
  const [code, setCode] = useState('')
  const [sql, setSQL] = useState(initialSQL)
  const { runCmd, stdout, stderr, fs, status } = useDevbook({ debug: true, env: Env.Supabase })
  
  // fs?.get('/components/Auth.js').then(content => console.log({ content }))

  function run() {
    const cmd = `psql postgresql://postgres:572570920Vasa@db.axzsxyxaetidbdskvkov.supabase.co -c '${sql}'`
    console.log({ cmd })
    runCmd(cmd)
  }

  const updateSQL = useCallback(content => {
    setSQL(content)
  }, [setSQL])
  
  const updateCode = useCallback(content => {
    fs?.write(filepath, content)
  }, [fs])
  
  useEffect(() => {
    async function init() {
      if (!fs) return
      if (status !== DevbookStatus.Connected) return
      if (!filepath) return
  
      console.log('RETRIEVING FILE')
      const fileContent = await fs.get(filepath)
      console.log('FILE CONTENT', { fileContent })
      setCode(fileContent)      
    }
    init()
  }, [status, fs, filepath])

  return (
    <div className="dbk-editor-wrapper">      
      {!initialSQL && !initialCode && <span>Loading</span>}
      {initialSQL && <button className="run-btn" onClick={run}>Run</button>}
      {initialSQL && (
        <>
          <DevbookEditor
            initialCode={initialSQL}
            language={language}
            onChange={updateSQL}
            filepath={filepath}
          />
          {(stdout.length > 0 || stderr.length > 0) && (
            <Output
              stdout={stdout}
              stderr={stderr}
            />
          )}
        </>
      )}
      {code && 
        <DevbookEditor
          initialCode={code}
          language={language}
          onChange={updateCode}
          filepath={filepath}
        />
      }
    </div>
  )
}
