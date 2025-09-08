import React, { lazy } from 'react'
import WithLoading from './components/WithLoading'
import { Navigate, Route, Routes } from 'react-router-dom'

import './styles/global.scss'

const Admin = lazy(() => import("./pages/Admin"))
const Login = lazy(() => import("./pages/Login"))

const App: React.FC = () => {
  return (
    <WithLoading>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='admin/*' element={<Admin />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </WithLoading>
  )
}

export default App
