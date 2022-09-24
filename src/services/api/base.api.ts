import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { StatusCode } from 'model/api/statusCode';

export class BaseApi {
    static baseUrl = 'https://ovvy.ru';
    static instance: AxiosInstance = axios.create({
        baseURL: BaseApi.baseUrl,
        responseType: 'json',
        headers: {
            common: {
                Authorization: `Bearer ${BaseApi.getToken()}`,
            },
        },
    });

    public static getToken() {
        return localStorage.getItem('ov-token') || null;
    }

    public static setToken(token: string) {
        localStorage.setItem('ov-token', token);
        this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    public static async getCoordinate(address: string) {
        const response = await this.instance.post('/api/', { action: 'getCoordsByAddress', params: address });

        if (response.data.status === StatusCode.Success) {
            return response.data.data.coords.map((coord) => parseFloat(coord));
        }
    }

    public static resolveArray(promise: Promise<AxiosResponse>) {
        return promise
            .then((response) => {
                let data = response.data;

                if (!data) {
                    return [];
                }

                return data;
            })
            .catch(() => {
                return [];
            });
    }

    public static getCity(text: string): Promise<any> {
        if (!text || text.length < 3) {
            return Promise.resolve([]);
        }

        return this.resolveArray(
            this.instance.get('/api/site/', {
                params: {
                    action: 'getCity',
                    text: text,
                },
            })
        );
    }

    public static getAddress(text: string, cityIds?: number[]): Promise<any> {
        if (!text || text.length < 3) {
            return Promise.resolve([]);
        }

        return this.resolveArray(
            this.instance.get('/api/site/', {
                params: {
                    action: 'getAddress',
                    text: text,
                    cityIds: cityIds,
                },
            })
        );
    }
}
