import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateStory from './pages/CreateStory'
import ViewStory from './pages/ViewStory'
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
            <Route path="/create-story" element={<CreateStory/>}/>
            <Route path="/view-story/:storyId" element={<ViewStory/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
