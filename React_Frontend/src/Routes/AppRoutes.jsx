import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage'
import Dashboard from '../components/dashboard/Dashboard'
import Signup from '../Pages/Auth/Signup'
import ProtectedRoute from './ProtectedRoute'
import Login from '../Pages/Auth/Login'
import Interview from '../components/dashboard/interview'
import InterviewHistory from "../components/dashboard/InterviewHistory";

const AppRoutes = () => {
   const token = localStorage.getItem("token");
  return (
    <Routes >
        <Route
            path='/'
            element={
              token ? <Dashboard /> : <LandingPage />
            }
          />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/interview' element={<Interview />} />
        <Route path='/landing-page' element={<LandingPage />} />
        <Route path="/history" element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
          />
        
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
    </Routes>
  )
}

export default AppRoutes