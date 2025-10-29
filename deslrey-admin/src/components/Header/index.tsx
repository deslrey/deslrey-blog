import React, { useState } from 'react'
import styles from './index.module.scss'
import { useTime } from '../../hooks/useTime'

import avatar from '../../assets/images/avatar.jpg'
import { useUserStore } from '../../store'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Message } from '../../utils/message'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {

    const navigate = useNavigate()

    const { timeText } = useTime()
    const { user, clearUser } = useUserStore()

    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        clearUser()
        Message.success("退出登陆成功")
        navigate('/login', { replace: true })
    }

    return (
        <div className={styles.headerBox}>
            <div className={styles.leftBox}>
                <img src={user.avatar || avatar} alt="avatar" className={styles.avatar} />
            </div>

            <div className={styles.midBox}>
                中间
            </div>

            <div className={styles.rightBox}>
                <span>{timeText} - {user.userName}</span>
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

            {/* 确认退出对话框 */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>确认退出</DialogTitle>
                <DialogContent>
                    确定要退出登录吗？
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant='contained' color='primary' onClick={() => setOpen(false)} >取消</Button>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default Header
