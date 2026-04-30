import React, { Suspense, useEffect, useMemo, useRef } from 'react'
import { Activity } from 'react'
import styles from './index.module.scss'
import { useRoutes, type RouteType } from '../../config/config'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import LoaderComponent from '../../components/LoaderComponent'
import TabsBar from '../../components/TabsBar'
import { useTabStore, getTabId } from '../../store'
import { TabLocationProvider } from '../../context/TabLocationContext'

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

function getPathFromLocation(pathname: string): string {
    const p = pathname.replace(/^\/admin\/?/, '').trim()
    return p || 'home'
}

const Admin: React.FC = () => {
    const sideList = useRoutes()
    const location = useLocation()
    const navigate = useNavigate()
    const { tabs, activeTabId, addOrActivateTab } = useTabStore()

    const path = useMemo(() => getPathFromLocation(location.pathname), [location.pathname])
    const search = location.search || ''
    const locationSourceRef = useRef(false)

    // 同步 URL -> 标签：每次 location 变化时添加或激活对应标签（不依赖 sideList，避免 useRoutes 每次返回新数组导致无限循环）
    useEffect(() => {
        locationSourceRef.current = true
        const route = sideList.find((r) => r.path === path)
        const label = route?.title ?? path
        const closable = path !== 'home'
        addOrActivateTab(path, search, label, closable)
    }, [path, search, addOrActivateTab])

    // 同步 当前激活标签 -> URL：仅当「点击标签/关闭标签」导致 activeTabId 变化时导航；若本次是侧栏 NavLink 触发的 location 变化，则跳过（避免用旧 activeTabId 导航回去造成死循环）
    useEffect(() => {
        if (locationSourceRef.current) {
            locationSourceRef.current = false
            return
        }
        if (!activeTabId) return
        const tab = tabs.find((t) => t.id === activeTabId)
        if (!tab) return
        const target = `/admin/${tab.path}${tab.search}`
        const current = location.pathname + (location.search || '')
        if (current !== target) navigate(target)
    }, [activeTabId, tabs, location.pathname, location.search, navigate])

    useEffect(() => {
        const currentRoute = sideList.find(item => `/admin/${item.path}` === location.pathname)
        if (currentRoute) {
            document.title = currentRoute.title
        } else {
            document.title = '404'
        }
    }, [location.pathname, sideList])

    const tabsToRender = useMemo(() => {
        if (tabs.length) return tabs
        const route = sideList.find((r) => r.path === path)
        return [{ id: getTabId(path, search), path, search, label: route?.title ?? path, closable: path !== 'home' }]
    }, [tabs, path, search, sideList])

    return (
        <div className={styles.mainBox}>
            <div className={styles.handlerBox}>
                <Header />
                <TabsBar />
            </div>
            <div className={styles.lastBox}>
                <div className={styles.sideBox}>
                    {sideList.map((item: RouteType) => (
                        <SideItem key={item.path} item={item} />
                    ))}
                </div>
                <div className={styles.contentBox}>
                    {tabsToRender.map((tab) => {
                        const isActive = activeTabId === tab.id || (tabs.length === 0 && tab.id === getTabId(path, search))
                        const route = sideList.find((r) => r.path === tab.path)
                        const content = route?.element ?? <div>页面不存在</div>
                        return (
                            <Activity key={tab.id} mode={isActive ? 'visible' : 'hidden'}>
                                <div className={styles.activityWrap} data-visible={isActive}>
                                    <TabLocationProvider path={tab.path} search={tab.search}>
                                        <Suspense fallback={<LoaderComponent />}>
                                            {content}
                                        </Suspense>
                                    </TabLocationProvider>
                                </div>
                            </Activity>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Admin
