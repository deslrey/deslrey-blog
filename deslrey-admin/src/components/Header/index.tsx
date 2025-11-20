import React, { useState, useMemo } from 'react'
import styles from './index.module.scss'
import { useTime } from '../../hooks/useTime'
import avatar from '../../assets/images/avatar.jpg'
import { useUserStore } from '../../store'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Message } from '../../utils/message'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRoutes } from '../../pages/Admin/config'

const Header: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const routes = useRoutes()

    const { timeText } = useTime()
    const { user, clearUser } = useUserStore()
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        clearUser()
        Message.success('退出登录成功')
        navigate('/login', { replace: true })
    }

    const currentTitle = useMemo(() => {
        const path = location.pathname.split('/').pop()
        const matchedRoute = routes.find(r => r.path === path)
        return matchedRoute?.title || '后台管理'
    }, [location.pathname, routes])

    return (
        <div className={styles.headerBox}>
            <div className={styles.leftBox}>
                <img src={user.avatar || avatar} alt="avatar" className={styles.avatar} />
            </div>

            <div className={styles.midBox}>
                <h2 className={styles.pageTitle}>{currentTitle}</h2>
            </div>

            <div className={styles.rightBox}>
                <span>
                    {timeText} - {user.userName}
                </span>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setOpen(true)}
                    style={{ marginLeft: '16px' }}
                >
                    退出登录
                </Button>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>确认退出</DialogTitle>
                <DialogContent>确定要退出登录吗？</DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                        取消
                    </Button>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Header
