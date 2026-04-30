import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { Message } from "../../utils/message";
import { onAuthExpired } from "../../utils/authEvents";

const AuthWatcher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearUser } = useUserStore();

    const loginOut = () => {
        clearUser();
        Message.error("请重新登陆");
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        try {
            const userInfo = sessionStorage.getItem("userInfo");
            if (!userInfo) {
                loginOut();
                return;
            }
            const stored = JSON.parse(userInfo);
            const token = stored?.state?.user?.token;
            if (location.pathname.startsWith("/admin")) {
                if (!token) {
                    loginOut();
                    return;
                }
            }
        } catch {
            loginOut();
            return;
        }
    }, [location.pathname, navigate, clearUser]);

    useEffect(() => {
        return onAuthExpired((message) => {
            clearUser();
            Message.error(message);
            navigate("/login", { replace: true });
        });
    }, [clearUser, navigate]);

    return null;
};

export default AuthWatcher;
