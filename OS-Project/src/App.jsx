import { Routes, Route } from 'react-router-dom' // 1. Import เข้ามา
import './App.css'
import WelcomePage from './components/WelcomePage'
import Test from './components/Test'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/next" element={<Test />} />
    </Routes>
  )
}

export default App