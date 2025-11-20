import React, { lazy } from 'react';
import WithLoading from './components/WithLoading';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthWatcher from './components/AuthWatcher';

import './styles/global.scss';

const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const App: React.FC = () => {
  return (
    <WithLoading>
      <AuthWatcher />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin/*' element={<Admin />} />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </WithLoading>
  );
};

export default App;
