import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import TruckLoadComponent from './loader/TruckLoadComponent'

// web端路由
const HomePage = lazy(() => import('./pages/HomePage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const ArchivePage = lazy(() => import('./pages/ArchivePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const CategoryTitlePage = lazy(() => import('./pages/CategoryTitlePage'))
const TagPage = lazy(() => import('./pages/TagPage'))
const TagTitlePage = lazy(() => import('./pages/TagTitlePage'))

// 404
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const App: React.FC = () => {
  return (
    <Suspense fallback={<TruckLoadComponent />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='article' element={<ArticlePage />} />
        <Route path='archive' element={<ArchivePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='detail/:id' element={<ArticleDetailPage />} />
        <Route path='category' element={<CategoryPage />} />
        <Route path='category/:category' element={<CategoryTitlePage />} />
        <Route path='tag' element={<TagPage />} />
        <Route path='tag/:tag' element={<TagTitlePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
