import { Customer } from 'model/dto/customer';
import { OrderItem } from 'model/dto/order.item';

export class MenuRequest {
    customer: Customer;
    order: OrderItem[];
    id: number;
    date: Date;
}
