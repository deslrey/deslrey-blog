import React, { lazy } from "react";

import {
    BiDetail,
    BiHomeAlt2,
    BiTaskX,
} from 'react-icons/bi';

export interface RouteType {
    path: string;
    disPlayName: string;
    element: React.ReactNode;
    icon?: React.ReactNode;
}

const About = lazy(() => import('../Admin/About'))
const AddArticle = lazy(() => import('../Admin/AddArticle'))
const Article = lazy(() => import('../Admin/Article'))
const Draft = lazy(() => import('../Admin/Draft'))
const Home = lazy(() => import('../Admin/Home'))

export const useRoutes = (): RouteType[] => [
    {
        path: '/home',
        disPlayName: '主页',
        element: <Home />,
        icon: <BiHomeAlt2 />
    },
    {
        path: '/article',
        disPlayName: '文章',
        element: <Article />,
        icon: <BiDetail />
    },
    {
        path: 'draft',
        disPlayName: '草稿箱',
        element: <Draft />,
        icon: <BiTaskX />
    },
    {
        path: '/about',
        disPlayName: '关于',
        element: <About />,
        icon: <BiHomeAlt2 />
    },
    {
        path: '/addArticle',
        disPlayName: '',
        element: <AddArticle />,
    }
]