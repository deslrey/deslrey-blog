export interface NavObj {
    title: string;
    key: string;
    icon: string;
    link: string;
}

export const NavList: NavObj[] = [
    {
        title: "主页",
        key: "home",
        icon: "dslrey-home2",
        link: "/",
    },
    {
        title: "文章",
        key: "article",
        icon: "dslrey-paper",
        link: "/article",
    },
    {
        title: "归档",
        key: "archive",
        icon: "dslrey-schedule",
        link: "/archive",
    },
    {
        title: "分类",
        key: "category",
        icon: "dslrey-folder",
        link: "/category",
    },
    {
        title: "关于",
        key: "about",
        icon: "dslrey-timerauto",
        link: "/about",
    },
];
