class LocalStorageUtil {
    /**
     * 设置一个键值对到 localStorage
     * @param key 键
     * @param value 值
     */
    static setItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error setting item in localStorage', error);
        }
    }

    /**
     * 从 localStorage 获取一个值
     * @param key 键
     * @returns 值
     */
    static getItem<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error('Error getting item from localStorage', error);
            return null;
        }
    }

    /**
     * 从 localStorage 移除一个键值对
     * @param key 键
     */
    static removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from localStorage', error);
        }
    }

    /**
     * 清空 localStorage
     */
    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
}

export default LocalStorageUtil;
