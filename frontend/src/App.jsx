import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "./context/auth/AuthContext"
import { useToast } from "./context/toast/ToastContext"
import Home from "./pages/home/Home"
import Search from "./pages/search/Search"
import Auth from "./pages/auth/Auth"
import CourseEditor from "./pages/courseEditor/CourseEditor"
import CourseLearn from "./pages/courseLearn/CourseLearn"
import CoursePage from "./pages/coursePage/CoursePage"
import TeacherCourses from "./pages/teacherCourses/TeacherCourses"
import Dashboard from "./pages/dashboard/Dashboard"
import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"
import Profile from "./pages/profile/Profile"
import ResetPassword from "./pages/resetPassword/ResetPassword"


const App = () => {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const handleExpired = () => {
      logout()
      showToast('Sessione scaduta, effettua nuovamente il login', 'error')
      navigate('/auth')
    }

    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/courses/:id/learn" element={<CourseLearn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/new" element={<CourseEditor />} />
          <Route path="/teacher/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
    
  )
}

export default App
