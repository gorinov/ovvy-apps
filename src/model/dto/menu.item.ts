import { WeightUnit } from 'model/enum/core';

export class MenuItem {
    id: number;
    enabled: boolean = true;
    name: string = '';
    description: string = '';
    sort: number = 1;
    configId: number;
    categoryId: number = 0;
    priceAfterDiscount: number;
    priceBeforeDiscount: number;
    weight: number;
    weightUnit: WeightUnit;
    calories: number;
    image: string;
    imageId: string;

    get price() {
        return this.priceBeforeDiscount || this.priceAfterDiscount;
    }

    set price(price) {
        this.priceBeforeDiscount = price;
        this.priceAfterDiscount = null;
    }

    constructor(configId: number) {
        this.configId = configId;
    }
}
