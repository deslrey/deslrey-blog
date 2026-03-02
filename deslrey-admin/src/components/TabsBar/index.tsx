import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { RotateCw, X, XCircle, ArrowLeft, XOctagon } from 'lucide-react'
import { useTabStore, type TabItem } from '../../store'
import styles from './index.module.scss'

const TabsBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTabId, removeTab, removeOthers, removeLeft, removeAll } = useTabStore()
  const navigate = useNavigate()
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null)
  const [menuTab, setMenuTab] = useState<TabItem | null>(null)

  if (tabs.length === 0) return null

  const handleSelect = (tab: TabItem) => {
    setActiveTabId(tab.id)
    navigate(`/admin/${tab.path}${tab.search}`)
  }

  const handleClose = (e: React.MouseEvent, tab: TabItem) => {
    e.stopPropagation()
    if (!tab.closable) return
    removeTab(tab.id)
  }

  const handleContextMenu = (e: React.MouseEvent, tab: TabItem) => {
    e.preventDefault()
    setMenuTab(tab)
    setMenuAnchor({ x: e.clientX, y: e.clientY })
  }

  const closeMenu = () => {
    setMenuAnchor(null)
    setMenuTab(null)
  }

  const handleRefresh = () => {
    if (!menuTab) return
    const nextTab = menuTab
    closeMenu()
    setActiveTabId(nextTab.id)
    navigate(`/admin/${nextTab.path}${nextTab.search}`, { replace: true })
    window.location.reload()
  }

  const handleCloseCurrent = () => {
    if (!menuTab) return
    const nextTab = menuTab
    closeMenu()
    if (nextTab.closable) removeTab(nextTab.id)
  }

  const handleCloseOthers = () => {
    if (!menuTab) return
    const nextTab = menuTab
    closeMenu()
    removeOthers(nextTab.id)
    navigate(`/admin/${nextTab.path}${nextTab.search}`)
  }

  const handleCloseLeft = () => {
    if (!menuTab) return
    closeMenu()
    removeLeft(menuTab.id)
    // 若当前即目标标签，无需导航；Admin 的 effect 会在 activeTabId 变化时处理
  }

  const handleCloseAll = () => {
    closeMenu()
    removeAll()
    const next = useTabStore.getState().tabs[0]
    if (next) navigate(`/admin/${next.path}${next.search}`)
  }

  const canCloseLeft = menuTab && tabs.findIndex((t) => t.id === menuTab.id) > 0
  const canCloseOthers = menuTab && tabs.some((t) => t.id !== menuTab.id && t.closable)
  const canCloseAll = tabs.some((t) => t.closable)

  return (
    <>
      <div className={styles.tabsBar}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTabId === tab.id ? styles.active : ''}`}
            onClick={() => handleSelect(tab)}
            onContextMenu={(e) => handleContextMenu(e, tab)}
            role="tab"
            aria-selected={activeTabId === tab.id}
          >
            <span className={styles.label}>{tab.label}</span>
            {tab.closable && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={(e) => handleClose(e, tab)}
                aria-label={`关闭 ${tab.label}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <Menu
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuAnchor ? { top: menuAnchor.y, left: menuAnchor.x } : undefined}
        slotProps={{ paper: { sx: { minWidth: 140 } } }}
      >
        <MenuItem onClick={handleRefresh}>
          <ListItemIcon><RotateCw size={16} /></ListItemIcon>
          <ListItemText>刷新页面</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseCurrent} disabled={!menuTab?.closable}>
          <ListItemIcon><X size={16} /></ListItemIcon>
          <ListItemText>关闭当前</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseOthers} disabled={!canCloseOthers}>
          <ListItemIcon><XCircle size={16} /></ListItemIcon>
          <ListItemText>关闭其他</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseLeft} disabled={!canCloseLeft}>
          <ListItemIcon><ArrowLeft size={16} /></ListItemIcon>
          <ListItemText>关闭左侧</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseAll} disabled={!canCloseAll}>
          <ListItemIcon><XOctagon size={16} /></ListItemIcon>
          <ListItemText>全部关闭</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default TabsBar
