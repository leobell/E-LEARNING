import { Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Search from "./pages/search/Search"
import Auth from "./pages/auth/Auth"
import CourseEditor from "./pages/courseEditor/CourseEditor"
import CourseLearn from "./pages/courseLearn/CourseLearn"
import CoursePage from "./pages/coursePage/CoursePage"
import TeacherCourses from "./pages/teacherCourses/TeacherCourses"
import Dashboard from "./pages/dashboard/Dashboard"
import Navbar from "./components/navbar/Navbar"


const App = () => {
  return (
    <>
      <Navbar />
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
      </Routes>
    </>
    
  )
}

export default App
