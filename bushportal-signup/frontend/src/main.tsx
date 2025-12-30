import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClientProvider, queryClient } from './lib/queryClient'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
