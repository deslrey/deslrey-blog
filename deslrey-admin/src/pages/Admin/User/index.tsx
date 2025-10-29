import React, { useState } from 'react'
import styles from './index.module.scss'
import request from '../../../utils/request'
import { userApi } from '../../../api/adminApi'
import { Message } from '../../../utils/message'
import { TextField, Button } from '@mui/material'
import qs from 'qs'

const UserPage: React.FC = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const updateUserInfoPassWord = async () => {
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            Message.warning('请填写完整信息')
            return
        }

        if (form.newPassword !== form.confirmPassword) {
            Message.error('两次输入的新密码不一致')
            return
        }

        try {
            const res = await request.post(
                userApi.updatePassword,
                qs.stringify({
                    olbPassWord: form.oldPassword,
                    newPassWord: form.newPassword
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )

            Message.success('密码修改成功')
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            Message.error('修改密码失败，请稍后再试')
        }
    }

    return (
        <div className={styles.userPage}>
            <div className={styles.updatePwssWordBBox}>
                <TextField
                    label="旧密码"
                    type="password"
                    variant="outlined"
                    value={form.oldPassword}
                    onChange={e => handleChange('oldPassword', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="新密码"
                    type="password"
                    variant="outlined"
                    value={form.newPassword}
                    onChange={e => handleChange('newPassword', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="确认新密码"
                    type="password"
                    variant="outlined"
                    value={form.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={updateUserInfoPassWord}
                    sx={{ marginTop: 2 }}
                >
                    确认修改
                </Button>
            </div>
        </div>
    )
}

export default UserPage
