import React, { Suspense, useEffect } from 'react'
import styles from './index.module.scss'
import { useRoutes, type RouteType } from './config'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import LoaderComponent from '../../components/LoaderComponent'

const SideItem: React.FC<{ item: RouteType }> = ({ item }) => {
    if (!item.disPlayName)
        return null
    return (
        <NavLink
            to={`/admin/${item.path}`}
            className={({ isActive }) => isActive ? `${styles.sideItem} ${styles.active}` : styles.sideItem}
        >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.disPlayName}</span>
        </NavLink>
    )
}

const Admin: React.FC = () => {
    const sideList = useRoutes()
    const location = useLocation()

    useEffect(() => {
        const currentRoute = sideList.find(item => `/admin/${item.path}` === location.pathname);
        if (currentRoute) {
            document.title = currentRoute.title;
        } else {
            document.title = '404';
        }
    }, [location.pathname, sideList])

    return (
        <div className={styles.mainBox}>
            <div className={styles.handlerBox}>
                <Header />
            </div>
            <div className={styles.lastBox}>
                <div className={styles.sideBox}>
                    {sideList.map((item: RouteType) => (
                        <SideItem key={item.path} item={item} />
                    ))}
                </div>
                <div className={styles.contentBox}>
                    <Suspense fallback={<LoaderComponent />}>
                        <Routes>
                            {sideList.map((item: RouteType) => (
                                <Route key={item.path} path={item.path} element={item.element} />
                            ))}

                            {/* 访问 /admin 时，默认跳到 /admin/home */}
                            <Route index element={<Navigate to="home" />} />

                            {/* 兜底 404 处理 */}
                            <Route path="*" element={<div>页面不存在</div>} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default Admin
