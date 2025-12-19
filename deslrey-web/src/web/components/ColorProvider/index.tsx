import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import useNavStore from "../../store/navStore";
import { useWebRoutes } from "../../../router/config";

const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colors = [
        "#4d96ff", // 蓝
        "#ffd93d", // 黄
        "#6bcB77", // 绿
        "#ff6b6b", // 红
        "#845ec2", // 紫
        "#ff77e9", // 粉
        "#00c9a7", // 青绿
        "#ffb347", // 橙黄
        "#9d4edd", // 深紫
    ];

    const colorsRGB = [
        "77,150,255",
        "255,217,61",
        "107,203,119",
        "255,107,107",
        "132,94,194",
        "255,119,233",
        "0,201,167",
        "255,179,71",
        "157,78,221",
    ];

    const [index, _setIndex] = useState(0);
    const location = useLocation();
    const routes = useWebRoutes();
    const setTitle = useNavStore((state) => state.setTitle);


    useEffect(() => {
        const pathname = location.pathname;

        const exactMatch = routes.find(r => r.path === pathname);
        if (exactMatch) {
            setTitle(exactMatch.title);
            return;
        }

        const dynamicRoute = routes.find(r =>
            pathname.startsWith(r.path + "/")
        );

        if (dynamicRoute) {
            const param = pathname.replace(dynamicRoute.path + "/", "");
            const decoded = decodeURIComponent(param);

            setTitle(`${dynamicRoute.title} · ${decoded}`);
            return;
        }
        setTitle("");
    }, [location.pathname]);


    useEffect(() => {
        document.documentElement.style.setProperty("--activeColor", colors[index]);
        document.documentElement.style.setProperty("--activeColor-rgb", colorsRGB[index]);
    }, [index]);

    return <>{children}</>;
};

export default ColorProvider;
