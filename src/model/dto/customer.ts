import { WayMode } from 'store/reducers/menu/menu';
import _ from 'lodash';
import { KeyValuePair } from 'model/enum/core';

export class Customer {
    name: string = '';
    phone: string = '';
    email: string = '';
    address: string = '';
    entrance: string = '';
    intercom: string = '';
    floor: string = '';
    apartment: string = '';
    comment: string = '';
    way: WayMode = WayMode.Restaurant;

    constructor(data?: KeyValuePair) {
        if (data) {
            _.forEach(data, (value, key) => {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            });
        }
    }

    get isValid(): boolean {
        return this.way === WayMode.Restaurant || (this.way === WayMode.Delivery && this.address?.length > 6 && this.phone?.length > 6);
    }
}
