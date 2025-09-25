import { House, Newspaper, Pencil, User, Image, Folder, Tag, ChartBarStacked } from "lucide-react";
import React, { lazy } from "react";

export interface RouteType {
    path: string;
    disPlayName: string;
    title: string,
    element: React.ReactNode;
    icon?: React.ReactNode;
}

const UserPage = lazy(() => import('./User'))
const AddArticle = lazy(() => import('../Admin/AddArticle'))
const EditArticle = lazy(() => import('../Admin/EditArticle'))
const Article = lazy(() => import('../Admin/Article'))
const CategoryPage = lazy(() => import('../Admin/Category'))
const TagPage = lazy(() => import('../Admin/Tag'))
const ImagePage = lazy(() => import('../Admin/Image'))
const FolderPage = lazy(() => import('../Admin/Folder'))
const Draft = lazy(() => import('../Admin/Draft'))
const Home = lazy(() => import('../Admin/Home'))

export const useRoutes = (): RouteType[] => [
    {
        path: 'home',
        disPlayName: '主页',
        title: '主页',
        element: <Home />,
        icon: <House color="#000000" />
    },
    {
        path: 'article',
        disPlayName: '文章',
        title: '文章',
        element: <Article />,
        icon: <Newspaper color="#000000" />
    },
    {
        path: 'imageTable',
        disPlayName: '图片',
        title: '图片',
        element: <ImagePage />,
        icon: <Image color="#000000" />
    },
    {
        path: 'folder',
        disPlayName: '目录',
        title: '目录',
        element: <FolderPage />,
        icon: <Folder color="#000000" />
    },
    {
        path: 'category',
        disPlayName: '分类',
        title: '分类',
        element: <CategoryPage />,
        icon: <ChartBarStacked color="#000000" />
    },
    {
        path: 'tag',
        disPlayName: '标签',
        title: '标签',
        element: <TagPage />,
        icon: <Tag color="#000000" />
    },
    {
        path: 'draft',
        disPlayName: '草稿箱',
        title: '草稿箱',
        element: <Draft />,
        icon: <Pencil color="#000000" />
    },
    {
        path: 'user',
        disPlayName: '用户',
        title: '用户',
        element: <UserPage />,
        icon: <User color="#000000" />
    },
    {
        path: 'addArticle',
        disPlayName: '',
        title: '添加文章',
        element: <AddArticle />,
    },
    {
        path: 'editArticle',
        disPlayName: '',
        title: '编辑文章',
        element: <EditArticle />,
    }
]