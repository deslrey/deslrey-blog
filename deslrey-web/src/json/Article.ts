import { Article, Classify } from "@/components/interfaces/Article";
import dayjs from "dayjs";

export const ClassifyList: Classify[] = [
    { title: "教程", total: 10 },
    { title: "例子", total: 15 },
    { title: "React", total: 10 },
];

export const ArticleList: Article[] = [
    {
        id: 1,
        title: "深入理解 TypeScript",
        des: "介绍 TypeScript 核心概念与最佳实践。",
        createTime: dayjs("2025-08-01 10:00").toDate(),
        edit: false,
        wordCount: 3200,
        readTime: 12,
        sticky: true,
    },
    {
        id: 2,
        title: "React 18 新特性解析",
        des: "快速上手 React 18 的并发特性与新 API。",
        createTime: dayjs("2025-07-20 14:30").toDate(),
        edit: true,
        wordCount: 2500,
        readTime: 9,
        sticky: false,
    },
    {
        id: 3,
        title: "前端性能优化实战",
        des: "总结常见性能优化方法与实用技巧。",
        createTime: dayjs("2025-06-10 08:15").toDate(),
        edit: false,
        wordCount: 4200,
        readTime: 15,
        sticky: false,
    },
    {
        id: 4,
        title: "Node.js 最佳实践",
        des: "如何在生产环境中高效运行 Node.js 应用。",
        createTime: dayjs("2025-06-15 08:15").toDate(),
        edit: false,
        wordCount: 4000,
        readTime: 15,
        sticky: false,
    },
    {
        id: 5,
        title: "Web 安全入门指南",
        des: "常见的 Web 安全漏洞与防护手段。",
        createTime: dayjs("2025-06-15 08:15").toDate(),
        edit: false,
        wordCount: 4000,
        readTime: 15,
        sticky: false,
    },
];
