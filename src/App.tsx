import { Routes, Route } from 'react-router-dom'
import Home from './components/LandingPage'
import About from './components/About'
import Courses from './components/Courses'
import Admission from './components/Admission'
import Contact from './components/Contact'
import Signup from './components/Signup'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import Teacher from './components/Teacher'
import StudentDashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/about' element={<About />}/>
      <Route path='/Courses' element={<Courses />}/>
      <Route path='/Admission' element={<Admission />}/>
      <Route path='/Contact' element={<Contact />}/>
      <Route path='/Signup' element={<Signup />}/>
      <Route path='/Login' element={<Login />}/>
      <Route path='/Admin' element={<AdminLogin />}/>
      <Route path='/teachers' element={<Teacher />}/>
      <Route path='/portal' element={<StudentDashboard />}/>
      <Route path='/admin-dashboard' element={<AdminDashboard />}/>
    </Routes>
  )
}