import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { Message } from "../../utils/message";

const AuthWatcher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUserStore();

    useEffect(() => {
        if (location.pathname.startsWith("/admin") && !user.token) {
            Message.error("请重新登陆")
            navigate("/login", { replace: true });
        }
    }, [location.pathname, user.token, navigate]);

    return null;
};

export default AuthWatcher;
