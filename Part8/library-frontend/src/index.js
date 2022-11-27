import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './components/App'

const root = ReactDOM.createRoot(document.getElementById('root'))
const strict = true

const rootComponent = <App />

root.render(
  strict ? <React.StrictMode>{rootComponent}</React.StrictMode> : rootComponent
)
