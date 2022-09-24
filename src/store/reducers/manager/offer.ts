import { Offer } from 'model/dto/offer';

export enum OfferTypes {
    LOADING = 'OFFER_LOADING',
    LOADED = 'OFFER_LOADED',
    SAVED = 'OFFER_SAVED',
    DELETE = 'OFFER_DELETE',
}

export interface IOfferState {
    loaded: boolean;
    offer: Offer[];
}

const initialState: IOfferState = {
    loaded: false,
    offer: [],
};

export default function (state = initialState, action) {
    let offer: Offer, offers, storeOfferIndex: number;

    switch (action.type) {
        case OfferTypes.LOADING:
            return { ...state, loaded: false };
        case OfferTypes.LOADED:
            return { ...state, offer: action.payload, loaded: true, message: null };
        case OfferTypes.SAVED:
            offer = action.payload;
            offers = [...state.offer];
            storeOfferIndex = offers.findIndex((item: Offer) => offer.id === item.id);

            if (storeOfferIndex !== -1) {
                offers[storeOfferIndex] = offer;
            } else {
                offers.push(offer);
            }

            return { ...state, offer: offers, loaded: true };
        case OfferTypes.DELETE:
            offer = action.payload;
            offers = [...state.offer];
            storeOfferIndex = offers.findIndex((item: Offer) => offer.id === item.id);

            if (storeOfferIndex !== -1) {
                offers.splice(storeOfferIndex, 1);
            }

            return { ...state, offer: offers, loaded: true };
        default:
            return state;
    }
}
