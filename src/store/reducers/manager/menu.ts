import { MenuSettings } from 'model/dto/menu.settings';
import _ from 'lodash';
import { MenuSettingsBuilder } from 'builder/menu.settings';
import { MenuRequest } from 'model/dto/menu.request';

export interface IMenuManagerState {
    settings: MenuSettings;
    settingsLoaded: boolean;
    requests: MenuRequest[];
    requestsLoaded: boolean;
    version: number;
    count: number;
}

const initialState: IMenuManagerState = {
    settings: null,
    settingsLoaded: false,
    requests: null,
    requestsLoaded: false,
    version: 0,
    count: 0,
};

export enum MenuManagerTypes {
    MENU_MANAGER_ITEM_REMOVED = 'MENU_MANAGER_ITEM_REMOVED',
    MENU_MANAGER_ITEM_SAVED = 'MENU_MANAGER_ITEM_SAVED',
    MENU_MANAGER_CATEGORY_SAVED = 'MENU_MANAGER_CATEGORY_SAVED',
    MENU_MANAGER_CATEGORY_REMOVED = 'MENU_MANAGER_CATEGORY_REMOVED',
    MENU_MANAGER_SETTINGS_SAVED = 'MENU_MANAGER_SETTINGS_SAVED',
    MENU_MANAGER_SETTINGS_LOADED = 'MENU_MANAGER_SETTINGS_LOADED',
    MENU_MANAGER_SETTINGS_LOADING = 'MENU_MANAGER_SETTINGS_LOADING',
    MENU_MANAGER_REQUESTS_LOADED = 'MENU_MANAGER_REQUESTS_LOADED',
    MENU_MANAGER_REQUESTS_LOADING = 'MENU_MANAGER_REQUESTS_LOADING',
}

export default function (state = initialState, action) {
    let itemIndex: number;
    let categoryIndex: number;
    let getItemIndexById = (id): number => {
        return _.findIndex(state.settings.items, (item) => item.id == id);
    };
    let getCategoryIndexById = (id): number => {
        return _.findIndex(state.settings.categories, (item) => item.id == id);
    };

    let settings;

    switch (action.type) {
        case MenuManagerTypes.MENU_MANAGER_REQUESTS_LOADING:
            return { ...state, requestsLoaded: false };
        case MenuManagerTypes.MENU_MANAGER_REQUESTS_LOADED:
            return { ...state, requests: action.payload.requests, count: action.payload.count, requestsLoaded: true };
        case MenuManagerTypes.MENU_MANAGER_SETTINGS_LOADING:
            return { ...state, settingsLoaded: false };
        case MenuManagerTypes.MENU_MANAGER_ITEM_REMOVED:
            itemIndex = getItemIndexById(action.payload.id);

            if (itemIndex !== -1) {
                state.settings.items.splice(itemIndex, 1);
            }

            return state;
        case MenuManagerTypes.MENU_MANAGER_ITEM_SAVED:
            itemIndex = getItemIndexById(action.payload.id);

            if (itemIndex > -1) {
                state.settings.items[itemIndex] = action.payload;
            } else {
                state.settings.items.push(action.payload);
            }

            state.settings.items = _.sortBy(state.settings.items, 'sort');

            MenuSettingsBuilder.setCountCategories(state.settings);

            return state;
        case MenuManagerTypes.MENU_MANAGER_CATEGORY_REMOVED:
            categoryIndex = getCategoryIndexById(action.payload.id);

            if (categoryIndex !== -1) {
                state.settings.categories.splice(categoryIndex, 1);
            }

            return state;
        case MenuManagerTypes.MENU_MANAGER_CATEGORY_SAVED:
            categoryIndex = getCategoryIndexById(action.payload.id);

            if (categoryIndex > -1) {
                state.settings.categories[categoryIndex] = action.payload;
            } else {
                state.settings.categories.push(action.payload);
            }

            state.settings.categories = _.sortBy(state.settings.categories, 'sort');

            return state;
        case MenuManagerTypes.MENU_MANAGER_SETTINGS_SAVED:
            settings = action.payload;

            MenuSettingsBuilder.setCountCategories(settings);

            return {
                ...state,
                settings: settings,
                version: state.version + 1,
            };
        case MenuManagerTypes.MENU_MANAGER_SETTINGS_LOADED:
            settings = action.payload;

            MenuSettingsBuilder.setCountCategories(settings);

            return { ...state, settings: settings, settingsLoaded: true };
        default:
            return state;
    }
}
