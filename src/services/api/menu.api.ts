import { BaseApi } from './base.api';
import { MenuSettings } from 'model/dto/menu.settings';
import { MenuCategoryResponse, MenuGetOrderResponse, MenuItemResponse, MenuSettingsResponse } from 'model/api/menu.settings';
import { MenuCategory } from 'model/dto/menu.category';
import { MenuItem } from 'model/dto/menu.item';
import { BaseResponse } from 'model/api/base.response';
import { BasketItem } from 'model/dto/basket.item';
import { MenuOrderResponse } from 'model/api/menu.order';
import { Customer } from 'model/dto/customer';

export class MenuApi extends BaseApi {
    public static getRequests(offset: number = 0): Promise<any> {
        return this.instance
            .get('/api/menu/', {
                params: {
                    action: 'getRequests',
                    data: offset,
                },
            })
            .then((response) => {
                return response.data;
            });
    }

    public static getOrder(orderId?: string): Promise<MenuGetOrderResponse> {
        return this.instance
            .get('/api/menu/', {
                params: {
                    action: 'getOrder',
                    data: orderId,
                },
            })
            .then((response) => {
                let data = response.data;

                if (data && data.errors) {
                    return Promise.reject(data.errors);
                }

                return data;
            });
    }

    public static getSettings(configId?: number): Promise<MenuSettingsResponse> {
        return this.instance
            .get('/api/menu/', {
                params: {
                    action: 'getSettings',
                    data: configId,
                },
            })
            .then((response) => {
                let data = response.data;

                if (data && data.errors) {
                    return Promise.reject(data.errors);
                }

                return data;
            });
    }

    public static async checkDomain(domain: string, configId: number): Promise<boolean> {
        const response = await this.instance.post('/api/menu/', {
            action: 'checkDomain',
            data: {
                domain: domain,
                configId: configId,
            },
        });

        return response.data.data;
    }

    public static async saveItem(item: MenuItem): Promise<MenuItemResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'saveItem',
            data: item,
        });

        return response.data;
    }

    public static async deleteItem(item: MenuItem): Promise<BaseResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'deleteItem',
            data: item,
        });

        return response.data;
    }

    public static async saveCategory(category: MenuCategory): Promise<MenuCategoryResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'saveCategory',
            data: category,
        });

        return response.data;
    }

    public static async deleteCategory(item: MenuCategory): Promise<BaseResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'deleteCategory',
            data: item,
        });

        return response.data;
    }

    public static async saveSettings(settings: MenuSettings): Promise<MenuSettingsResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'saveSettings',
            data: settings,
        });

        return response.data;
    }

    public static async saveOrder(configId: number, items: BasketItem[], customer?: Customer): Promise<MenuOrderResponse> {
        const response = await this.instance.post('/api/menu/', {
            action: 'saveOrder',
            data: {
                configId: configId,
                order: items,
                customer: customer,
            },
        });

        return response.data;
    }

    public static async getTelegramChats(id: number): Promise<string> {
        const response = await this.instance.post('/api/menu/', {
            action: 'getTelegramChats',
            message: id,
        });

        return response.data?.data;
    }

    public static async addTelegramChat(data: any): Promise<string> {
        const response = await this.instance.post('/api/menu/', {
            action: 'addTelegramChat',
            data: data,
        });

        return response.data;
    }

    public static async removeTelegramChat(data: any): Promise<string> {
        const response = await this.instance.post('/api/menu/', {
            action: 'removeTelegramChat',
            data: data,
        });

        return response.data;
    }
}
