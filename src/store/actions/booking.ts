import { StatusCode } from 'model/api/statusCode';
import { BookingApi } from 'services/api/booking.api';
import { BookingTypes } from '../reducers/booking';
import { AppTypes } from '../reducers/app';
import { BookingSettingsBuilder } from 'builder/booking.settings';
import { BookingSettings } from 'model/dto/booking.settings';
import _ from 'lodash';
import { BookingRequestBuilder } from 'builder/booking.request';
import { BookingSettingsResponse } from 'model/api/booking.settings';
import { BookingRequestInfo, BookingRequestsResponse } from 'model/api/booking.request';
import { AppUtil } from 'utils/app.util';

export class BookingActions {
    static saveSettings(settings: BookingSettings, successAction?: (id: number) => void, errorAction?: (message: string) => void) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BookingSettingsResponse = await BookingApi.saveSettings(settings);

            if (response.status === StatusCode.Success) {
                const settings = BookingSettingsBuilder.build(response.data);

                dispatch({
                    type: BookingTypes.BOOKING_SETTING_LOADED,
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

    static getSettings(providerId?: number) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });
            dispatch({
                type: BookingTypes.BOOKING_SETTING_LOADING,
            });

            const response: BookingSettingsResponse = await BookingApi.getSettings(providerId);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: BookingTypes.BOOKING_SETTING_LOADED,
                    payload: BookingSettingsBuilder.build(response.data),
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static getRequests() {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });
            dispatch({
                type: BookingTypes.BOOKING_REQUESTS_LOADING,
            });

            const response: BookingRequestsResponse = await BookingApi.getRequests();

            if (response.status === StatusCode.Success && response.data) {
                dispatch({
                    type: BookingTypes.BOOKING_REQUESTS_LOADED,
                    payload: _.map(response.data, (request: BookingRequestInfo) => BookingRequestBuilder.build(request)),
                });
            } else {
                dispatch({
                    type: BookingTypes.BOOKING_REQUESTS_LOADED,
                    payload: null,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }
}
