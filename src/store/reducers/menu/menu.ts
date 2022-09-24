import { MenuSettings } from 'model/dto/menu.settings';
import { BasketUtil } from 'utils/basket.util';
import { BasketItem } from 'model/dto/basket.item';
import { StorageService } from 'services/storage.service';
import { Config } from 'services/config';

export enum MenuMode {
    Check = 'check',
    Menu = 'menu',
}

export enum WayMode {
    Delivery = 'delivery',
    Restaurant = 'restaurant',
}

export type MenuAppState = {
    settings: MenuSettings;
    basket: BasketItem[];
    orderUrl: string;
    loaded: boolean;
    error: string;
    orderHash: string;
    mode: MenuMode;
};

const initialState: MenuAppState = {
    settings: null,
    basket: [],
    error: null,
    loaded: false,
    orderUrl: null,
    orderHash: null,
    mode: Config.getInstance().orderId ? MenuMode.Check : MenuMode.Menu,
};

export enum MenuAppTypes {
    SET_MODE = 'MENU_APP_SET_MODE',
    LOADED = 'MENU_APP_LOADED',
    LOADED_WITH_ORDER = 'MENU_APP_LOADED_WITH_ORDER',
    ADD_TO_BASKET = 'MENU_APP_ADD_TO_BASKET',
    REMOVE_FROM_BASKET = 'MENU_APP_REMOVE_FROM_BASKET',
    COMPLETE = 'MENU_APP_COMPLETE',
    ERROR = 'MENU_APP_ERROR',
    CLEAR = 'MENU_APP_CLEAR',
}

let basket;
export default function (state = initialState, action) {
    switch (action.type) {
        case MenuAppTypes.ERROR:
            return { ...state, error: action.payload, loaded: true };
        case MenuAppTypes.SET_MODE:
            return { ...state, mode: action.payload };
        case MenuAppTypes.ADD_TO_BASKET:
            basket = BasketUtil.addToBasket([...state.basket], action.payload);
            StorageService.push(Config.menuBasketKey + '-' + state.settings.id, BasketUtil.basketToStorage(basket));

            return { ...state, basket: basket, loaded: true };
        case MenuAppTypes.REMOVE_FROM_BASKET:
            basket = BasketUtil.removeFromBasket([...state.basket], action.payload);
            StorageService.push(Config.menuBasketKey + '-' + state.settings.id, BasketUtil.basketToStorage(basket));

            return { ...state, basket: basket, loaded: true };
        case MenuAppTypes.COMPLETE:
            StorageService.push(Config.menuOrderHash + '-' + state.settings.id, action.payload.hash);
            StorageService.push(Config.menuOrderLink + '-' + state.settings.id, action.payload.link);

            return { ...state, orderUrl: action.payload.link, mode: MenuMode.Check, orderHash: action.payload.hash, error: null };
        case MenuAppTypes.CLEAR:
            StorageService.remove(Config.menuBasketKey + '-' + state.settings.id);
            StorageService.remove(Config.menuOrderHash + '-' + state.settings.id);
            StorageService.remove(Config.menuOrderLink + '-' + state.settings.id);
            Config.getInstance().orderId = null;

            return { ...state, orderUrl: null, orderHash: null, basket: [], mode: MenuMode.Menu, error: null };
        case MenuAppTypes.LOADED_WITH_ORDER:
            let data = action.payload;

            basket = BasketUtil.orderToBasket(data.order, data.settings.items);

            return {
                ...state,
                loaded: true,
                mode: MenuMode.Check,
                settings: data.settings,
                basket: BasketUtil.orderToBasket(data.order, data.settings.items),
                orderUrl: data.orderUrl,
                orderHash: BasketUtil.getHash(basket),
            };
        case MenuAppTypes.LOADED:
            const settings = action.payload;
            const hash = StorageService.get(Config.menuOrderHash + '-' + settings.id);
            const link = StorageService.get(Config.menuOrderLink + '-' + settings.id);

            basket = StorageService.get(Config.menuBasketKey + '-' + settings.id);

            if (basket) {
                basket = BasketUtil.storageToBasket(basket, settings.items);
            }

            return {
                ...state,
                mode: hash && basket ? MenuMode.Check : MenuMode.Menu,
                settings: action.payload,
                basket: basket || [],
                orderUrl: link,
                orderHash: hash,
                loaded: true,
            };
        default:
            return state;
    }
}
