import { Device } from 'utils/device';
import { Customer } from 'model/dto/customer';

export enum SnackbarMessageKind {
    Error = 'error',
    Success = 'success',
}

export class SnackbarMessage {
    constructor(public kind: SnackbarMessageKind, public text: string) {}
}

export interface IAppState {
    loaded: boolean;
    overlap: boolean;
    snackbarMessage: SnackbarMessage;
    popup: any;
    isMobile: boolean;
    isLaptop: boolean;
    customer?: Customer;
}

const initialState: IAppState = {
    loaded: false,
    overlap: false,
    snackbarMessage: null,
    popup: null,
    isMobile: Device.isMobile,
    isLaptop: Device.isLaptop,
};

export enum AppTypes {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    SHOW_SNACKBAR = 'SHOW_SNACKBAR',
    HIDE_SNACKBAR = 'HIDE_SNACKBAR',
    SET_IS_MOBILE = 'SET_IS_MOBILE',
    SET_IS_LAPTOP = 'SET_IS_LAPTOP',
    SET_CUSTOMER = 'SET_CUSTOMER',
}

const localStorageCustomerData = localStorage.getItem('ov-customer');
if (localStorageCustomerData) {
    initialState.customer = new Customer(JSON.parse(localStorageCustomerData));
} else {
    initialState.customer = new Customer();
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AppTypes.SET_CUSTOMER:
            localStorage.setItem('ov-customer', JSON.stringify(action.payload));

            return {
                ...state,
                customer: action.payload,
            };
        case AppTypes.SET_IS_MOBILE:
            return {
                ...state,
                isMobile: action.payload,
            };
        case AppTypes.SET_IS_LAPTOP:
            return {
                ...state,
                isLaptop: action.payload,
            };
        case AppTypes.SHOW_SNACKBAR:
            return {
                ...state,
                snackbarMessage: action.payload,
            };
        case AppTypes.HIDE_SNACKBAR:
            return {
                ...state,
                snackbarMessage: null,
            };
        case AppTypes.LOADING:
            return {
                ...state,
                loaded: false,
            };
        case AppTypes.LOADED:
            return {
                ...state,
                loaded: true,
            };
        default:
            return state;
    }
}
