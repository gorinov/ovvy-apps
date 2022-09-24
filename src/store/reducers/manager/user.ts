import { DateUtil } from 'utils/date';
import { User } from 'model/dto/user';
import { Guest } from 'model/dto/guest';

export enum UserTypes {
    LOGOUT = 'LOGOUT',
    LOGIN = 'LOGIN',
    LOGIN_ERROR = 'LOGIN_ERROR',
    CREATE = 'USER_CREATE',
    CREATE_ERROR = 'USER_CREATE_ERROR',
    UPDATE = 'USER_UPDATE',
    UPDATE_ERROR = 'USER_UPDATE_ERROR',
    RESET = 'RESET',
    DATA_FILLED = 'USER_DATA_FILLED',
}

export interface IUserState {
    user: User;
    isAuth: boolean;
    guest: Guest;
}

const localStorageUserData = localStorage.getItem('ov-user');
const localStorageGuestData = localStorage.getItem('ov-guest');

const initialState: IUserState = localStorageUserData
    ? JSON.parse(localStorageUserData)
    : {
          isAuth: false,
          user: null,
          guest: null,
      };

if (localStorageGuestData) {
    initialState.guest = JSON.parse(localStorageGuestData);
}

if (initialState.guest?.date) {
    initialState.guest.date = DateUtil.resolve(initialState.guest.date);
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UserTypes.LOGIN:
            localStorage.setItem('ov-user', JSON.stringify({ user: action.payload, isAuth: true }));

            return {
                ...state,
                isAuth: true,
                user: action.payload,
            };
        case UserTypes.LOGIN_ERROR:
            localStorage.removeItem('ov-user');

            return {
                ...state,
                isAuth: false,
                errorMessage: action.payload,
            };
        case UserTypes.UPDATE:
            localStorage.setItem('ov-user', JSON.stringify({ user: action.payload, isAuth: true }));

            return {
                ...state,
                isAuth: true,
                user: action.payload,
            };
        case UserTypes.LOGOUT:
            localStorage.removeItem('ov-user');
            localStorage.removeItem('ov-token');

            return {
                user: null,
                isAuth: false,
            };
        case UserTypes.DATA_FILLED:
            localStorage.setItem('ov-guest', JSON.stringify(action.payload));

            return {
                ...state,
                guest: action.payload,
            };
        default:
            return state;
    }
}
