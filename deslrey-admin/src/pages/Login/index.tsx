import React, { useState } from "react";
import {
    TextField,
    Button,
    Paper,
    Typography,
    Alert,
} from "@mui/material";

import styles from "./index.module.scss";
import request from "../../utils/request";
import { Message } from "../../utils/message";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import type { User } from "../../interfaces";
import { loginApi } from "../../api/publicApi";

interface LoginForm {
    userName: string;
    passWord: string;
}
const LoginPage: React.FC = () => {

    const navigator = useNavigate()

    const [form, setForm] = useState<LoginForm>({ userName: "", passWord: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.userName || !form.passWord) {
            setError("用户名和密码不能为空");
            return;
        }

        try {
            const res = await request.post<User>(loginApi.login, form)
            if (res && res.code === 200) {
                const data = res.data
                useUserStore.getState().setUser({
                    userName: data.userName,
                    token: data.token,
                    email: data.email,
                    avatar: data.avatar
                })
                Message.success(res.message)

                navigator("/admin")
            }
        } catch (error) {
            Message.error('登陆失败')
        }
    };

    return (
        <div className={styles.loginMain}>
            <div className={styles.leftBox}>
                <div>
                    {/*Logo / Banner 图 */}
                </div>
            </div>

            <div className={styles.rightBox}>
                <Paper
                    elevation={3}
                    sx={{ width: 350, padding: 4, borderRadius: 3, alignSelf: "center" }}
                >
                    <Typography variant="h5" align="center" gutterBottom>
                        登录
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            label="用户名"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="密码"
                            name="passWord"
                            type="password"
                            value={form.passWord}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            登录
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );
};

export default LoginPage;
