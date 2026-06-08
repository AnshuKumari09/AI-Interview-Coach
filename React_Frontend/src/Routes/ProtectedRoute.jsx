// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Signup from '../Pages/Auth/Signup'
// import Login from '../Pages/Auth/Login'

// const ProtectedRoute = () => {
//   return (
//     <Routes>
//         <Route path='/signup' element={<Signup />} />
//         <Route path='/login' element={<Login />} />
//     </Routes>
//   )
// }

// export default ProtectedRoute


import React, { Children } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem("token");

  return token? children :<Navigate to='/landing-page' replace />;
}

export default ProtectedRoute