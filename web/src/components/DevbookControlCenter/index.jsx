import React from 'react'
import { Editor } from '@devbookhq/ui'
import { jsPanel } from 'jspanel4/es6module/jspanel'

import './Panel.css'

import Portal from './Portal'

let globalPanel = undefined

const startingPosition = 'right-center -50 20'
const startingSize = {
  width: '450px',
  height: '600px',
}

class Panel extends React.Component {
  constructor() {
    super()
    if (globalPanel) {
      globalPanel.front(() => {
        globalPanel.resize(startingSize)
        globalPanel.reposition(startingPosition)
      })
    } else {
      globalPanel = jsPanel.create({
        headerTitle: '\xa0',
        theme: '#292929',
        headerControls: {
          minimize: 'remove',
          smallify: 'remove',
          close: 'remove',
          maximize: 'remove',
        },
        position: startingPosition,
        contentSize: startingSize,
        contentOverflow: 'auto',
        onwindowresize: false,
        content: panel => {
          const div = document.createElement('div')
          const newId = `${panel.id}-node`
          div.id = newId
          panel.content.append(div)
        },
        callback: panel => {
          const maxHeight = window.innerHeight - (window.innerHeight * 30) / 100
          panel.content.style.maxHeight = `${maxHeight}px`
          panel.content.style.maxWidth = `${window.innerWidth - 20}px`
        },
        onclosed: () => {
          globalPanel = undefined
        },
      })
    }
  }

  render() {
    if (!globalPanel) return null
    const node = document.getElementById(`${globalPanel.id}-node`)

    return (
      <Portal rootNode={node}>
        <Editor
          initialContent='console.log(4)'
        />
      </Portal>
    )
  }
}

export default Panel
