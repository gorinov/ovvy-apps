import {SettingTypes} from "../../actions/manager/setting";

export interface ISettingState {
    loaded: boolean;
    setting: any;
}

const initialState: ISettingState = {
    loaded: false,
    setting: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SettingTypes.LOADING:
            return {setting: null, loaded: false};
        case SettingTypes.LOADED:
            return {setting: action.payload, loaded: true};
        default:
            return state;
    }
}