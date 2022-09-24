import { BookingSettings } from 'model/dto/booking.settings';
import { BookingRequest } from 'model/dto/booking.request';
import { BookingConfirm } from 'model/dto/booking.confirm';

export interface IBookingState {
    confirm: BookingConfirm;
    settings: BookingSettings;
    requests: BookingRequest[];
    settingsLoaded: boolean;
    requestsLoaded: boolean;
    version: number;
}

const localStorageBookingConfirm = localStorage.getItem('ov-booking-confirm');

const initialState: IBookingState = {
    confirm: localStorageBookingConfirm ? JSON.parse(localStorageBookingConfirm) : null,
    settings: null,
    requests: [],
    settingsLoaded: false,
    requestsLoaded: false,
    version: 0,
};

export enum BookingTypes {
    BOOKING_CHECKOUT = 'BOOKING_CHECKOUT',
    BOOKING_CLEAR = 'BOOKING_CLEAR',
    BOOKING_SETTING_LOADING = 'BOOKING_SETTING_LOADING',
    BOOKING_SETTING_LOADED = 'BOOKING_SETTING_LOADED',
    BOOKING_REQUESTS_LOADED = 'BOOKING_REQUESTS_LOADED',
    BOOKING_REQUESTS_LOADING = 'BOOKING_REQUESTS_LOADING',
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BookingTypes.BOOKING_CHECKOUT:
            let bookingConfirm: BookingConfirm = action.payload;

            localStorage.setItem('ov-booking-confirm', JSON.stringify(bookingConfirm));

            return { ...state, confirm: bookingConfirm };
        case BookingTypes.BOOKING_CLEAR:
            localStorage.removeItem('ov-booking-confirm');

            return { ...state, confirm: null };
        case BookingTypes.BOOKING_REQUESTS_LOADING:
            return {
                ...state,
                requestsLoaded: false,
            };
        case BookingTypes.BOOKING_SETTING_LOADING:
            return {
                ...state,
                settingsLoaded: false,
            };
        case BookingTypes.BOOKING_SETTING_LOADED:
            return { ...state, settings: action.payload, settingsLoaded: true, version: state.version + 1 };
        case BookingTypes.BOOKING_REQUESTS_LOADED:
            return { ...state, requests: action.payload, requestsLoaded: true };
        default:
            return state;
    }
}
