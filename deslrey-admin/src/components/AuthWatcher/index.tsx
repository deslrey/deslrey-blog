import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { Message } from "../../utils/message";

const AuthWatcher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearUser } = useUserStore();

    const loginOut = () => {
        clearUser();
        Message.error("请重新登陆");
        navigate("/login", { replace: true });
    }

    useEffect(() => {
        try {
            console.log(location.pathname);
            const userInfo = sessionStorage.getItem("userInfo")
            if (!userInfo) {
                loginOut()
                return
            }
            const stored = JSON.parse(userInfo);
            const token = stored?.state?.user?.token
            if (location.pathname.startsWith("/admin")) {
                if (!token) {
                    loginOut()
                    return
                }
            }
        } catch (error) {
            loginOut()
            return
        }
    }, [location.pathname, navigate, clearUser]);

    return null;
};

export default AuthWatcher;
