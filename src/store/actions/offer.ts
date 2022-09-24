import { OfferTypes } from '../reducers/manager/offer';
import { StatusCode } from 'model/api/statusCode';
import { BaseResponse } from 'model/api/base.response';
import { Offer } from 'model/dto/offer';
import { OfferApi } from 'services/api/offer.api';
import { OfferInfo, OfferResponse } from 'model/api/offer';
import { OfferBuilder } from 'builder/offer';
import { AppUtil } from 'utils/app.util';
import { AppTypes } from 'store/reducers/app';
import _ from 'lodash';

export class OfferActions {
    static save(offer: Offer) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BaseResponse = await OfferApi.save(offer);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: OfferTypes.SAVED,
                    payload: OfferBuilder.build(response.data),
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

    static delete(offer: Offer) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BaseResponse = await OfferApi.delete(offer);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: OfferTypes.DELETE,
                    payload: offer,
                });

                AppUtil.showSuccessSnackbar('Акция удалена');
            } else {
                AppUtil.showErrorSnackbar(response.data.message);
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static getByCredential() {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: OfferResponse = await OfferApi.getByCredential();

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: OfferTypes.LOADED,
                    payload: _.map(response.data, (offer) => OfferBuilder.build(offer)),
                });
            } else {
                dispatch({
                    type: OfferTypes.LOADED,
                    payload: null,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }

    static getByMenu(id: number) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: OfferResponse = await OfferApi.getByMenu(id);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: OfferTypes.LOADED,
                    payload: _.map(response.data, (offer) => OfferBuilder.build(offer)),
                });
            } else {
                dispatch({
                    type: OfferTypes.LOADED,
                    payload: null,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }
}
