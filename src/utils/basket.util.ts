import { BasketItem } from 'model/dto/basket.item';
import _ from 'lodash';
import { MenuItem } from 'model/dto/menu.item';
import { KeyValuePair } from 'model/enum/core';

export class BasketUtil {
    static getHash(basket: BasketItem[]): string {
        let data = _.map(
            _.sortBy(
                _.map(basket, (basketItem: BasketItem) => {
                    return {
                        quantity: basketItem.quantity,
                        id: basketItem.item.id,
                    };
                }),
                (item) => item.id
            ),
            (item) => item.id + ':' + item.quantity
        );

        return _.toString(data);
    }

    static basketToStorage(basket: BasketItem[]): KeyValuePair[] {
        return _.map(basket, (basketItem: BasketItem) => {
            return {
                quantity: basketItem.quantity,
                id: basketItem.item.id,
            };
        });
    }

    static orderToBasket(order: KeyValuePair, items: any[]): BasketItem[] {
        return _.map(order, (orderItem) => {
            const item: MenuItem = _.find(items, (item) => item.id == orderItem.id);

            if (orderItem.price) {
                item.price = orderItem.price;
            }

            return item ? new BasketItem(item, orderItem.quantity) : undefined;
        });
    }

    static storageToBasket(storage: KeyValuePair, items: any[]) {
        return _.compact(
            _.map(storage, (storageItem) => {
                const item: MenuItem = _.find(items, (item) => item.id == storageItem.id);

                return item ? new BasketItem(item, storageItem.quantity) : undefined;
            })
        );
    }

    public static addToBasket(items: BasketItem[], item: MenuItem): BasketItem[] {
        let alreadyAddedItem: BasketItem = items.find((addedItem: BasketItem) => addedItem.item.id === item.id);

        if (alreadyAddedItem) {
            alreadyAddedItem.quantity += 1;
        } else {
            items.push(new BasketItem(item, 1));
        }

        return items;
    }

    public static removeFromBasket(items: BasketItem[], item: MenuItem): BasketItem[] {
        let removableItem: BasketItem = items.find((removableItem: BasketItem) => removableItem.item.id === item.id);

        if (!removableItem) {
            return items;
        }

        if (removableItem.quantity > 1) {
            removableItem.quantity -= 1;

            return items;
        } else {
            _.remove(items, (removableItem: BasketItem) => removableItem.item.id === item.id);

            return items;
        }
    }
}
