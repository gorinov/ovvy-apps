import { Api } from 'utils/api';

export enum SettingTypes {
    LOADING = 'SETTING_LOADING',
    LOADED = 'SETTING_LOADED',
    LOADING_ERROR = 'SETTING_LOADING_ERROR',
}

export class SettingActions {
    static getFormCompanyData() {
        return async (dispatch) => {
            try {
                dispatch({
                    type: SettingTypes.LOADING,
                });

                const formData = await Api.getFormCompanyData();

                dispatch({
                    type: SettingTypes.LOADED,
                    payload: formData,
                });
            } catch (e) {
                dispatch({
                    type: SettingTypes.LOADING_ERROR,
                    payload: {},
                });
            }
        };
    }
}
