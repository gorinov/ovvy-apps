import { MenuRequestInfo } from 'model/api/menu.request';
import { MenuRequest } from 'model/dto/menu.request';
import { Customer } from 'model/dto/customer';
import { KeyValuePair } from 'model/enum/core';
import { OrderItem } from 'model/dto/order.item';
import _ from 'lodash';

export class MenuRequestBuilder {
    static build(menuRequestInfo: MenuRequestInfo): MenuRequest {
        let menuRequest: MenuRequest = new MenuRequest();

        menuRequest.id = menuRequestInfo.id;
        menuRequest.customer = new Customer(menuRequestInfo.customer);
        menuRequest.order = _.map(menuRequestInfo.data, (item) => this.buildOrder(item));
        menuRequest.date = new Date(menuRequestInfo.createdDate * 1000);

        return menuRequest;
    }

    static buildOrder(data: KeyValuePair): OrderItem {
        const order = new OrderItem();

        order.name = data.name;
        order.quantity = data.quantity;
        order.price = data.price;
        order.categoryId = data.categoryId;
        order.itemId = data.id;

        return order;
    }
}
