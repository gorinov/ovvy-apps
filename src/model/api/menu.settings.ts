import { BaseResponse } from './base.response';
import { MenuCategoryInfo } from 'model/api/menu.category';
import { MenuItemInfo } from 'model/api/menu.item';
import { KeyValuePair } from 'model/enum/core';
import { IWorkingTimeInfo } from 'model/api/company';
import { City } from 'model/dto/menu.settings';

export interface MenuSettingsInfo {
    id: number;
    domain: string;
    enabled: boolean;
    providerId: number;
    message?: string;
    name: string;
    type: string;
    categories: MenuCategoryInfo[];
    items: MenuItemInfo[];
    showDisabledMenuItems: boolean;
    delivery: boolean;
    minPrice: number;
    phone: string;
    deliveryTime: IWorkingTimeInfo;
    telegram: KeyValuePair[];
    email: string;
    city: City[];
}

export interface MenuSettingsResponse extends BaseResponse {
    data: MenuSettingsInfo;
}

export interface MenuCategoryResponse extends BaseResponse {
    data: MenuCategoryInfo;
}

export interface MenuItemResponse extends BaseResponse {
    data: MenuItemInfo;
}

export interface MenuGetOrderResponse extends BaseResponse {
    data: {
        data: string;
        customer: KeyValuePair;
        uuid: string;
        orderUrl: string;
    };
}
