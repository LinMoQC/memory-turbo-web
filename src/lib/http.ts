import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import LocalStorageUtil from './localStorageUtil';
import toast from 'react-hot-toast';
import { useLoadingStore } from '@/stores/global-loading';
import { clearCookies } from '@/actions/auth.action';

class AxiosClient {
    private instance: AxiosInstance;
    private readonly defaultConfig: AxiosRequestConfig;

    constructor(baseURL: string, timeout: number = 10000) {
        this.defaultConfig = {
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        };
        this.instance = axios.create(this.defaultConfig);

        // 确保跨域请求时携带 cookies
        this.instance.defaults.withCredentials = true;

        this.instance.interceptors.request.use(
            (config) => {
                const accessToken = LocalStorageUtil.getItem('accessToken')
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                useLoadingStore.getState().setLoading(true);
                return config;
            },
            (error) => {
                toast.error(error.message)
                useLoadingStore.getState().setLoading(false);
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                useLoadingStore.getState().setLoading(false);
                return response.data;
            },
            async (error) => {
                useLoadingStore.getState().setLoading(false);
                if (error.response) {
                    const originalRequest = error.config;

                    // 如果错误是 401 Unauthorized，尝试刷新 token
                    if (error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;  // 防止无限循环

                        try {
                            // 请求新的 accessToken
                            const response = await this.instance.get('/auth/refresh');
                            const newAccessToken = response.data.accessToken
                            LocalStorageUtil.setItem('accessToken', newAccessToken)
                            // 更新原始请求的 Authorization header
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            return this.instance(originalRequest);
                        } catch (refreshError) {
                            console.error('Refresh token failed:', refreshError);
                            LocalStorageUtil.clear()
                            await clearCookies()
                            window.location.href = '/login';
                        }
                    }
                    // 处理其他错误（例如后端传回的错误信息）
                    const errorMessage = error.response.data?.message || error.message;
                    console.error('Error response:', errorMessage);
                    toast.error(errorMessage);  
                    return Promise.reject(errorMessage);
                } else {
                    // 网络错误或者没有响应
                    toast.error(error.message)
                    console.error('Error:', error.message);
                    return Promise.reject(error);
                }
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, method: 'GET' });
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, data, method: 'POST' });
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, data, method: 'PUT' });
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, data, method: 'PATCH' });
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, method: 'DELETE' });
    }

    private async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance({
                url,
                ...config,
            });
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    }

    public async retryRequest<T>(requestFunc: () => Promise<T>, retries: number = 3): Promise<T> {
        try {
            return await requestFunc();
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying... (${3 - retries + 1})`);
                return this.retryRequest(requestFunc, retries - 1);
            }
            throw error;
        }
    }
}

const HttpClient = new AxiosClient(`${process.env.NEXT_PUBLIC_BACKEN_ADDRESS}`)

export default HttpClient;
