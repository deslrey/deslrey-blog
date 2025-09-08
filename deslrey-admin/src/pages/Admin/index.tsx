import React from 'react'
import styles from './index.module.scss'
import { useRoutes, type RouteType } from './config'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import WithLoading from '../../components/WithLoading'

const SideItem: React.FC<{ item: RouteType }> = ({ item }) => {
    if (!item.disPlayName) {
        return null
    }

    return (
        <NavLink to={`/admin/${item.path}`}>
            <div className={styles.sideItem}>
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.disPlayName}</span>
            </div>
        </NavLink>
    )
}

const Admin: React.FC = () => {
    const sideList = useRoutes()

    return (
        <div className={styles.mainBox}>
            <div className={styles.handlerBox}>
                顶部
            </div>
            <div className={styles.lastBox}>
                <div className={styles.sideBox}>
                    {sideList.map((item: RouteType) => (
                        <SideItem key={item.path} item={item} />
                    ))}
                </div>
                <div className={styles.contentBox}>
                    <WithLoading>
                        <Routes>
                            {sideList.map((item: RouteType) => (
                                <Route key={item.path} path={item.path} element={item.element} />
                            ))}

                            {/* 访问 /admin 时，默认跳到 /admin/home */}
                            <Route index element={<Navigate to="home" />} />

                            {/* 兜底 404 处理 */}
                            <Route path="*" element={<div>页面不存在</div>} />
                        </Routes>
                    </WithLoading>

                </div>
            </div>
        </div>
    )
}

export default Admin
