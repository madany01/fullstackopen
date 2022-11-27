import React from 'react'
import ReactDOM from 'react-dom/client'

import Root from './components/Root'

const root = ReactDOM.createRoot(document.getElementById('root'))
const strict = true

const rootComponent = <Root />

root.render(
  strict ? <React.StrictMode>{rootComponent}</React.StrictMode> : rootComponent
)
