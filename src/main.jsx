import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/share-tech-mono/400.css'
import '@fontsource/stalinist-one/400.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import './index.css'
import App from './App.jsx'
import MainPage from './mainpage.jsx'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
