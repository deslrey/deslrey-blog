import type { RouteType } from "../interfaces/router";
import { Archive, House, Newspaper, User } from "lucide-react";


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
        path: '/note',
        disPlayName: '摘记',
        title: '摘记',
        element: null,
        icon: <Archive />
    },
    {
        path: '/about',
        disPlayName: '关于',
        title: '关于',
        element: null,
        icon: <User />
    },
]