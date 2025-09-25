import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { Message } from "./message";
import { useUserStore } from "../store";

export interface Results<T = any> {
    code: number;
    data: T;
    message: string;
}

class Request {
    private instance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                const token = useUserStore.getState().user.token;
                if (token && config.headers) {
                    config.headers.Authorization = `token ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                const res = response.data;
                if (res.code === 401) {
                    Message.error("登录超时，请重新登录");
                    const store = useUserStore.getState();
                    store.clearUser();
                    window.location.href = "/login";
                    return Promise.reject(res);
                }
                if (res.code !== 200) {
                    Message.error(res.message);
                    return Promise.reject(res);
                }
                return response;
            },
            (error) => {
                Message.error("请求异常");
                return Promise.reject(error);
            }
        );


    }

    // GET
    public async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<Results<T>> {
        const res = await this.instance.get<Results<T>>(url, config);
        return res.data;
    }

    // POST
    public async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<Results<T>> {
        const res = await this.instance.post<Results<T>>(url, data, config);
        return res.data;
    }

    // PUT
    public async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<Results<T>> {
        const res = await this.instance.put<Results<T>>(url, data, config);
        return res.data;
    }

    // DELETE
    public async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<Results<T>> {
        const res = await this.instance.delete<Results<T>>(url, config);
        return res.data;
    }
}

const request = new Request({
    baseURL: "/deslrey",
    timeout: 5000,
});

export default request;
