export interface NavObj {
    title: string;
    key: string;
    icon: string;
    link: string;
}

export const NavList: NavObj[] = [
    {
        title: "Article",
        key: "article",
        icon: "dslrey-paper",
        link: "/article",
    },
    {
        title: "Archive",
        key: "archive",
        icon: "dslrey-schedule",
        link: "/archive",
    },
    {
        title: "Category",
        key: "category",
        icon: "dslrey-folder",
        link: "/category",
    },
    {
        title: "About",
        key: "about",
        icon: "dslrey-timerauto",
        link: "/about",
    },
];
