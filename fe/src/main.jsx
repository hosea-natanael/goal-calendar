import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Goal from './pages/Goal'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/calendar/:calendarId" element={<Calendar/>}/>
            <Route path="/goal/:calendarId" element={<Goal/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes> 
    </BrowserRouter>
)
