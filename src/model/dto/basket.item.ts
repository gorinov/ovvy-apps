import { MenuItem } from 'model/dto/menu.item';

export class BasketItem {
    item: MenuItem;
    quantity: number;

    constructor(item: MenuItem, quantity: number) {
        this.item = item;
        this.quantity = quantity;
    }
}
