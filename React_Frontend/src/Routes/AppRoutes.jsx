import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage'
import Dashboard from '../components/dashboard/Dashboard'
import Signup from '../Pages/Auth/Signup'
import ProtectedRoute from './ProtectedRoute'
import Login from '../Pages/Auth/Login'
import SetUpScreen from '../components/Interview/SetUpScreen'
import InterviewHistory from "../components/dashboard/InterviewHistory";
import Interview from '../components/dashboard/interview'
import Page2 from '../components/Interview/Page2'
import Page3 from '../components/Interview/Page3'
import Popup from '../components/InterviewRoom/PopUp'

const AppRoutes = () => {
   const token = localStorage.getItem("token");
  return (
    <Routes >
        <Route
            path='/'
            element={
              token ? <SetUpScreen /> : <LandingPage />
            }
          />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
       
        <Route path='/landing-page' element={<LandingPage />} />
        <Route path="/history" element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
          />
          <Route path="/upload" element={
          <ProtectedRoute>
            <Page2 />
          </ProtectedRoute>
        }
          />

        <Route path="/interview" element={
          <ProtectedRoute>
            <Page3 />
          </ProtectedRoute>
        }
          />
        
         <Route path="/new-interview" element={
          <ProtectedRoute>
            <Popup />
          </ProtectedRoute>
        }
          />
        
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path='/history' element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        } />
        
    </Routes>
  )
}

export default AppRoutes