import { MenuCategory } from 'model/dto/menu.category';
import { MenuItem } from 'model/dto/menu.item';
import { KeyValuePair } from 'model/enum/core';
import { DateUtil, IWorkingTime } from 'utils/date';

export class City {
    constructor(public id: number, public name: string, public type: string, public regionName: string, public regionType: string) {}
}

export class MenuSettings {
    id: number;
    enabled: boolean = false;
    showDisabledMenuItems: boolean = false;
    domain: string = '';
    name: string = '';
    providerId: number;
    categories: MenuCategory[];
    items: MenuItem[];
    type: string = '';
    minPrice: number = null;
    style: KeyValuePair;
    delivery: boolean = false;
    phone: string = '';
    deliveryTime: IWorkingTime = DateUtil.generateTime();
    email: string = '';
    telegram: KeyValuePair[] = [];
    city: City[] = [];

    get title() {
        return this.type + ' ' + this.name;
    }
}
