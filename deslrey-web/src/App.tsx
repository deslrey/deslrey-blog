import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import TruckLoadComponent from './loader/TruckLoadComponent'

// web端路由
const HomePage = lazy(() => import('./web/pages/HomePage'))
const ArticlePage = lazy(() => import('./web/pages/ArticlePage'))
const ArchivePage = lazy(() => import('./web/pages/ArchivePage'))
const AboutPage = lazy(() => import('./web/pages/AboutPage'))
const ArticleDetailPage = lazy(() => import('./web/pages/ArticleDetailPage'))
const CategoryPage = lazy(() => import('./web/pages/CategoryPage'))
const CategoryTitlePage = lazy(() => import('./web/pages/CategoryTitlePage'))
const TagPage = lazy(() => import('./web/pages/TagPage'))
const TagTitlePage = lazy(() => import('./web/pages/TagTitlePage'))

// 404
const NotFoundPage = lazy(() => import('./web/pages/NotFoundPage'))

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
