import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import TruckLoadComponent from './loader/TruckLoadComponent'

// web端路由
const HomePage = lazy(() => import('./web/pages/HomePage'))
const ArticlePage = lazy(() => import('./web/pages/ArticlePage'))
const ArchivePage = lazy(() => import('./web/pages/ArchivePage'))
const NotePage = lazy(() => import('./web/pages/NotePage'))
const AboutPage = lazy(() => import('./web/pages/AboutPage'))
const ArticleDetailPage = lazy(() => import('./web/pages/ArticleDetailPage'))
const CategoryPage = lazy(() => import('./web/pages/CategoryPage'))
const TagPage = lazy(() => import('./web/pages/TagPage'))

// 404
const NotFoundPage = lazy(() => import('./web/pages/NotFoundPage'))

const App: React.FC = () => {
  return (
    <Suspense fallback={<TruckLoadComponent />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='article' element={<ArticlePage />} />
        <Route path='archive' element={<ArchivePage />} />
        <Route path='note' element={<NotePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='detail/:id' element={<ArticleDetailPage />} />
        <Route path='category/:category' element={<CategoryPage />} />
        <Route path='tag/:tag' element={<TagPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
