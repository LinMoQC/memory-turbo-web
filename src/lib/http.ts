import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 可以在这里添加 token 等请求头
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                // 处理错误
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    return Promise.reject(error.response.data);
                } else {
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

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>(url, { ...config, method: 'DELETE' });
    }

    private async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance({
                url,
                ...config,
            });
            return response.data; // 直接返回数据部分
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

const HttpClient = new AxiosClient(process.env.BACKEN_ADDRESS || 'http://localhost:3000')

export default HttpClient;
