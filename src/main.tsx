import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log('main.tsx is being executed')

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('ReactDOM.createRoot has been called')