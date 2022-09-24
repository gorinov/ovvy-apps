import {Delivery} from "../../model/dto/delivery";

export interface IDeliveryState extends Delivery{}

const localStorageDelivery = localStorage.getItem('ov-delivery');

const initialState: IDeliveryState = localStorageDelivery ? JSON.parse(localStorageDelivery) : {
    number: null,
    saved: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'DELIVERY_SAVE':
            let delivery: Delivery = action.payload;

            localStorage.setItem('ov-delivery', JSON.stringify(delivery));

            return {
                ...state,
                number: delivery.number,
                saved: true
            };
        case 'DELIVERY_CLEAR':
            localStorage.removeItem('ov-delivery');
            localStorage.removeItem('ov-basket');

            return {
                ...state,
                number: null,
                saved: false
            };
        default:
            return state
    }
}