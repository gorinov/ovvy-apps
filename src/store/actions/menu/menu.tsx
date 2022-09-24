import { StatusCode } from 'model/api/statusCode';
import { AppTypes } from '../../reducers/app';
import { MenuSettingsBuilder } from 'builder/menu.settings';
import { MenuApi } from 'services/api/menu.api';
import { MenuGetOrderResponse, MenuSettingsResponse } from 'model/api/menu.settings';
import { MenuAppTypes } from 'store/reducers/menu/menu';
import { BasketItem } from 'model/dto/basket.item';
import { MenuOrderResponse } from 'model/api/menu.order';
import { BasketUtil } from 'utils/basket.util';
import { Customer } from 'model/dto/customer';

export class MenuActions {
    static saveOrder(configId: number, order: BasketItem[], customer?: Customer) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: MenuOrderResponse = await MenuApi.saveOrder(configId, order, customer);
            if (response.status === StatusCode.Success) {
                const link = response.data;

                dispatch({
                    type: MenuAppTypes.COMPLETE,
                    payload: {
                        link: link,
                        hash: BasketUtil.getHash(order),
                    },
                });
            } else {
                dispatch({
                    type: MenuAppTypes.ERROR,
                    payload: response.data.message,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static getSettings(configId: number, orderId?: string) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const configResponse: MenuSettingsResponse = await MenuApi.getSettings(configId);
            if (configResponse.status === StatusCode.Success) {
                if (orderId) {
                    const orderResponse: MenuGetOrderResponse = await MenuApi.getOrder(orderId);

                    if (orderResponse.status === StatusCode.Success) {
                        if (orderResponse.data.customer) {
                            dispatch({
                                type: AppTypes.SET_CUSTOMER,
                                payload: new Customer(orderResponse.data.customer),
                            });
                        }

                        dispatch({
                            type: MenuAppTypes.LOADED_WITH_ORDER,
                            payload: {
                                order: orderResponse.data.data,
                                orderId: orderResponse.data.uuid,
                                orderUrl: orderResponse.data.orderUrl,
                                settings: MenuSettingsBuilder.build(configResponse.data),
                            },
                        });
                    }
                } else {
                    dispatch({
                        type: MenuAppTypes.LOADED,
                        payload: MenuSettingsBuilder.build(configResponse.data),
                    });
                }
            } else {
                dispatch({
                    type: MenuAppTypes.ERROR,
                    payload: configResponse.data.message,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }
}
