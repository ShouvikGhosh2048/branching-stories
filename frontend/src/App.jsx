import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthContextProvider } from './contexts/authContext'

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar/>
        <div className="p-2">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
