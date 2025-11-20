import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthWatcher from './components/AuthWatcher';

import './styles/global.scss';
import LoaderComponent from './components/LoaderComponent';

const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Suspense fallback={<LoaderComponent />}>
        <AuthWatcher />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin/*' element={<Admin />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
