import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { Message } from "../../utils/message";

const AuthWatcher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearUser } = useUserStore();

    useEffect(() => {
        console.log(location.pathname);
        const stored = sessionStorage.getItem("userInfo");
        if (location.pathname.startsWith("/admin")) {
            if (!stored) {
                clearUser();
                Message.error("请重新登陆");
                navigate("/login", { replace: true });
            }
        }
    }, [location.pathname, navigate, clearUser]);

    return null;
};

export default AuthWatcher;
