import type { RouteType } from "../interfaces/router";
import { Archive, House, Newspaper, Tag, User } from "lucide-react";


export const useWebRoutes = (): RouteType[] => [
    {
        path: '/',
        disPlayName: '主页',
        title: '主页',
        element: null,
        icon: <House />
    },
    {
        path: '/article',
        disPlayName: '文章',
        title: '文章',
        element: null,
        icon: <Newspaper />
    },
    {
        path: '/category',
        disPlayName: '分类',
        title: '分类',
        element: null,
        icon: <Archive />
    },
    {
        path: '/tag',
        disPlayName: '标签',
        title: '标签',
        element: null,
        icon: <Tag />
    },
    {
        path: '/about',
        disPlayName: '关于',
        title: '关于',
        element: null,
        icon: <User />
    },
]