import React from "react";
import { useLocation } from "react-router";
import { useWebRoutes } from "../../router/config";
import SEO from "../SEO";

const TitleSyncComponent:React.FC = () => {
    const location = useLocation();
    const routes = useWebRoutes();

    const route = routes.find((r: any) => r.path === location.pathname);
    const title = route ? `${route.title} - deslrey博客` : "deslrey博客";

    return <SEO title={title} />;
};

export default TitleSyncComponent;
