import React, { lazy } from 'react'
import { Route, Routes } from 'react-router'

//  web端路由
const HomePage = lazy(() => import('./web/pages/HomePage'))
const ArticlePage = lazy(() => import('./web/pages/ArticlePage'))
const ArchivePage = lazy(() => import('./web/pages/ArchivePage'))
const AboutPage = lazy(() => import('./web/pages/AboutPage'))


//  404
const NotFoundPage = lazy(() => import('./web/pages/NotFoundPage'))

const App: React.FC = () => {

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='article' element={<ArticlePage />} />
      <Route path='archive' element={<ArchivePage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App