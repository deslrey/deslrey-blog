import React, { useState } from 'react'
import styles from './index.module.scss'
import request from '../../../utils/request'
import { userApi } from '../../../api/adminApi'
import { Message } from '../../../utils/message'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import qs from 'qs'
import { useUserStore } from '../../../store'
import { useNavigate } from 'react-router-dom'

const UserPage: React.FC = () => {
    const navigate = useNavigate()
    const { clearUser } = useUserStore()

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [usernameForm, setUserNameForm] = useState({
        oldName: '',
        newName: ''
    })

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        type: 'password' | 'username' | null
    }>({ open: false, type: null })

    const handleChange = (key: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [key]: value }))
    }

    const handleNameChange = (key: string, value: string) => {
        setUserNameForm(prev => ({ ...prev, [key]: value }))
    }

    const handleLogout = () => {
        clearUser()
        navigate('/login', { replace: true })
    }

    const handleConfirm = (type: 'password' | 'username') => {
        setConfirmDialog({ open: true, type })
    }

    const handleConfirmSubmit = async () => {
        if (confirmDialog.type === 'password') {
            await updateUserInfoPassWord()
        } else if (confirmDialog.type === 'username') {
            await updateUserName()
        }
        setConfirmDialog({ open: false, type: null })
    }

    const updateUserInfoPassWord = async () => {
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            Message.warning('请填写完整信息')
            return
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            Message.error('两次输入的新密码不一致')
            return
        }

        try {
            const res = await request.post(
                userApi.updatePassword,
                qs.stringify({
                    olbPassWord: passwordForm.oldPassword,
                    newPassWord: passwordForm.newPassword
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )

            if (res && res.code === 200) {
                Message.success('密码修改成功，请重新登录')
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                handleLogout()
            } else {
                Message.error(res.message || '修改失败')
            }
        } catch {
            Message.error('修改密码失败，请稍后再试')
        }
    }

    const updateUserName = async () => {
        if (!usernameForm.oldName || !usernameForm.newName) {
            Message.warning('请输入旧用户名和新用户名')
            return
        }

        try {
            const res = await request.post(
                userApi.updateUserName,
                qs.stringify({
                    oldName: usernameForm.oldName,
                    newName: usernameForm.newName
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )

            if (res && res.code === 200) {
                Message.success('用户名修改成功，请重新登录')
                setUserNameForm({ oldName: '', newName: '' })
                handleLogout()
            } else {
                Message.error(res.message || '修改失败')
            }
        } catch {
            Message.error('修改用户名失败，请稍后再试')
        }
    }

    return (
        <div className={styles.userPage}>
            <div className={styles.updatePwssWordBBox}>
                <h3>修改密码</h3>
                <TextField
                    label="旧密码"
                    type="password"
                    variant="outlined"
                    value={passwordForm.oldPassword}
                    onChange={e => handleChange('oldPassword', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="新密码"
                    type="password"
                    variant="outlined"
                    value={passwordForm.newPassword}
                    onChange={e => handleChange('newPassword', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="确认新密码"
                    type="password"
                    variant="outlined"
                    value={passwordForm.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleConfirm('password')}
                    sx={{ marginTop: 2 }}
                >
                    修改密码
                </Button>
            </div>

            <div className={styles.updateUserNameBox}>
                <h3>修改用户名</h3>
                <TextField
                    label="旧用户名"
                    variant="outlined"
                    value={usernameForm.oldName}
                    onChange={e => handleNameChange('oldName', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="新用户名"
                    variant="outlined"
                    value={usernameForm.newName}
                    onChange={e => handleNameChange('newName', e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleConfirm('username')}
                    sx={{ marginTop: 2 }}
                >
                    修改用户名
                </Button>
            </div>

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, type: null })}
            >
                <DialogTitle>确认操作</DialogTitle>
                <DialogContent>
                    {confirmDialog.type === 'password'
                        ? '确定要修改密码吗？修改后需要重新登录。'
                        : '确定要修改用户名吗？修改后需要重新登录。'}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, type: null })}>
                        取消
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary" variant="contained">
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UserPage
