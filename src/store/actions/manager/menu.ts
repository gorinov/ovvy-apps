import { StatusCode } from 'model/api/statusCode';
import { AppTypes } from '../../reducers/app';
import { MenuSettingsBuilder } from 'builder/menu.settings';
import { MenuSettings } from 'model/dto/menu.settings';
import { MenuApi } from 'services/api/menu.api';
import { MenuManagerTypes } from 'store/reducers/manager/menu';
import { MenuCategoryResponse, MenuItemResponse, MenuSettingsResponse } from 'model/api/menu.settings';
import { MenuCategory } from 'model/dto/menu.category';
import { AppUtil } from 'utils/app.util';
import { MenuItem } from 'model/dto/menu.item';
import { BaseResponse } from 'model/api/base.response';
import { BookingRequestsResponse } from 'model/api/booking.request';
import _ from 'lodash';
import { MenuRequestInfo } from 'model/api/menu.request';
import { MenuRequestBuilder } from 'builder/menu.request';

export class MenuActions {
    static getRequests(offset: number = 0) {
        return async (dispatch) => {
            dispatch({
                type: MenuManagerTypes.MENU_MANAGER_REQUESTS_LOADING,
            });

            const response: BookingRequestsResponse = await MenuApi.getRequests(offset);
            if (response.status === StatusCode.Success && response.data) {
                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_REQUESTS_LOADED,
                    payload: {
                        count: response.data.count,
                        requests: _.map(response.data.requests, (request: MenuRequestInfo) => MenuRequestBuilder.build(request)),
                    },
                });
            } else {
                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_REQUESTS_LOADED,
                    payload: null,
                });
            }
        };
    }

    static saveItem(item: MenuItem, successAction?: () => void) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: MenuItemResponse = await MenuApi.saveItem(item);

            if (response.status === StatusCode.Success) {
                const item = MenuSettingsBuilder.buildItem(response.data);

                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_ITEM_SAVED,
                    payload: item,
                });

                AppUtil.showSuccessSnackbar('Сохранено');

                successAction?.();
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static deleteItem(item: MenuItem, successAction?: () => void) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BaseResponse = await MenuApi.deleteItem(item);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_ITEM_REMOVED,
                    payload: item,
                });

                AppUtil.showSuccessSnackbar('Позиция удалена');

                successAction?.();
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static saveCategory(category: MenuCategory, successAction: () => void) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: MenuCategoryResponse = await MenuApi.saveCategory(category);

            if (response.status === StatusCode.Success) {
                const category = MenuSettingsBuilder.buildCategory(response.data);

                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_CATEGORY_SAVED,
                    payload: category,
                });

                AppUtil.showSuccessSnackbar('Сохранено');

                successAction?.();
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static deleteCategory(category: MenuCategory, successAction?: () => void) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BaseResponse = await MenuApi.deleteCategory(category);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_CATEGORY_REMOVED,
                    payload: category,
                });

                AppUtil.showSuccessSnackbar('Категория удалена');

                successAction?.();
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static saveSettings(settings: MenuSettings) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: MenuSettingsResponse = await MenuApi.saveSettings(settings);

            if (response.status === StatusCode.Success) {
                const settings = MenuSettingsBuilder.build(response.data);

                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_SETTINGS_SAVED,
                    payload: settings,
                });

                AppUtil.showSuccessSnackbar('Сохранено');
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static getSettings() {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: MenuSettingsResponse = await MenuApi.getSettings();
            if (response.status === StatusCode.Success) {
                dispatch({
                    type: MenuManagerTypes.MENU_MANAGER_SETTINGS_LOADED,
                    payload: MenuSettingsBuilder.build(response.data),
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }
}
