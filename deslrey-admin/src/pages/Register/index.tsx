import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper
} from "@mui/material";
import Styles from "./index.module.scss";
import { Message } from "../../utils/message";
import request from "../../utils/request";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/publicApi";

interface FormState {
    userName: string;
    email: string;
    passWord: string;
}

interface FormErrors {
    userName?: string;
    email?: string;
    passWord?: string;
}

const RegisterPage: React.FC = () => {

    document.title = '注册';

    const naviagte = useNavigate()

    const [form, setForm] = useState<FormState>({
        userName: "",
        email: "",
        passWord: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): FormErrors => {
        const errs: FormErrors = {};
        if (!form.userName.trim()) {
            errs.userName = "用户名不能为空";
        }
        if (!form.email.trim()) {
            errs.email = "邮箱不能为空";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                errs.email = "邮箱格式不正确";
            }
        }
        if (!form.passWord) {
            errs.passWord = "密码不能为空";
        } else if (form.passWord.length < 6) {
            errs.passWord = "密码至少 6 位";
        }
        return errs;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validation = validate();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        try {
            const res = await request.post(registerApi.register, form)
            if (res && res.code === 200) {
                Message.success(res.message)
                Message.success('跳转至登陆页面进行登陆')
                naviagte('/')
            }
        } catch (error) {

        }

    };

    return (
        <Box className={Styles.registerPage}>
            <Paper elevation={3} className={Styles.registerCard}>
                <Typography variant="h5" gutterBottom align="center">
                    用户注册
                </Typography>


                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="用户名"
                        variant="outlined"
                        margin="normal"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        error={Boolean(errors.userName)}
                        helperText={errors.userName}
                        required
                    />
                    <TextField
                        fullWidth
                        label="邮箱"
                        variant="outlined"
                        margin="normal"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        fullWidth
                        label="密码"
                        variant="outlined"
                        margin="normal"
                        name="passWord"
                        type="passWord"
                        value={form.passWord}
                        onChange={handleChange}
                        error={Boolean(errors.passWord)}
                        helperText={errors.passWord}
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        注册
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegisterPage;
