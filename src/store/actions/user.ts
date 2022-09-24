import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { AppTypes } from '../reducers/app';
import { UserTypes } from '../reducers/manager/user';
import { UserValidateResponse } from 'model/api/user/validate';

export class UserActions {
    static validate(successAction, failedAction) {
        return async (dispatch) => {
            dispatch({ type: AppTypes.LOADING });

            const response: UserValidateResponse = await UserApi.validate();

            dispatch({ type: AppTypes.LOADED });

            if (response.status === StatusCode.Success) {
                dispatch({ type: UserTypes.LOGIN, payload: response.data });

                successAction();
            } else {
                dispatch({ type: UserTypes.LOGIN_ERROR });

                failedAction();
            }
        };
    }
}
