import './App.css'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './components/WelcomePage'
import SetupPage from './components/SetupPage'
import InputResourcePage from './components/InputResourcePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/inputResc" element={<InputResourcePage />} />
    </Routes>
  )
}

export default App