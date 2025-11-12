import './App.css'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './components/WelcomePage'
import SetupPage from './components/SetupPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/setup" element={<SetupPage />} />
    </Routes>
  )
}

export default App