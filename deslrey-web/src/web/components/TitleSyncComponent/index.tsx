import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useWebRoutes } from "../../../router/config";

const TitleSyncComponent:React.FC = () => {
    const location = useLocation();
    const routes = useWebRoutes();

    useEffect(() => {
        const route = routes.find(r => r.path === location.pathname);

        if (route) {
            document.title = route.title + " - deslrey博客";
        } else {
            document.title = "deslrey博客";
        }
    }, [location.pathname]);

    return null;
};

export default TitleSyncComponent;
