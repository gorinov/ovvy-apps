import { FeedbackTypes } from '../reducers/manager/feedback';
import { FeedbackApi } from 'services/api/feedback-api';
import { FeedbackInfo, FeedbackResponse } from 'model/api/feedback';
import { FeedbackBuilder } from 'builder/feedback';
import { StatusCode } from 'model/api/statusCode';
import { BaseResponse } from 'model/api/base.response';
import { Feedback } from 'model/dto/feedback';
import { AppTypes } from 'store/reducers/app';
import { AppUtil } from 'utils/app.util';

export class FeedbackActions {
    static setAnswer(feedback: Feedback) {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: BaseResponse = await FeedbackApi.setAnswer(feedback);

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: FeedbackTypes.UPDATE,
                    payload: feedback,
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

    static getAll() {
        return async (dispatch) => {
            dispatch({
                type: AppTypes.LOADING,
            });

            const response: FeedbackResponse = await FeedbackApi.getAll();

            if (response.status === StatusCode.Success) {
                dispatch({
                    type: FeedbackTypes.LOADED,
                    payload: (response.data as FeedbackInfo[]).map((feedback) => FeedbackBuilder.build(feedback)),
                });
            } else {
                dispatch({
                    type: FeedbackTypes.LOADED,
                    payload: null,
                });
            }

            dispatch({
                type: AppTypes.LOADED,
            });
        };
    }
}
