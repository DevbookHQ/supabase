import React, {
  useState,
  useEffect,
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
  const [code, setCode] = useState('')
  const { runCmd, stdout, stderr, fs, status } = useDevbook({ debug: true, env: Env.Supabase })
  
  // fs?.get('/components/Auth.js').then(content => console.log({ content }))

  function run() {
    const cmd = `psql postgresql://postgres:572570920Vasa@db.axzsxyxaetidbdskvkov.supabase.co -c '${sql}'`
    console.log({ cmd })
    runCmd(cmd)
  }

  function updateCode(content) {
    setCode(content)
    fs?.write(filepath, content)
  }

  useEffect(function getFileContent() {
    if (!fs) return
    if (status !== DevbookStatus.Connected) return
    if (!filepath) return

    console.log('RETRIEVING FILE')
    fs.get(filepath).then(content => { 
      console.log('FILE CONTENT', { content })
      setCode(content)
    })
  }, [status, fs, filepath])

  return (
    <div className="dbk-editor-wrapper">      
      {!sql && !code && <span>Loading</span>}
      {sql && <button className="run-btn" onClick={run}>Run</button>}
      {sql && (
        <>
          <DevbookEditor
            initialCode={sql}
            language={language}
            onChange={updateCode}
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
