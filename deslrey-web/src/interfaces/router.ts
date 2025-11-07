import type React from "react";

export interface RouteType {
    path: string;
    disPlayName: string;
    title: string,
    element: React.ReactNode;
    icon?: React.ReactNode;
}