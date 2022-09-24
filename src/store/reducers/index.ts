import { combineReducers } from 'redux';
import app, { IAppState } from './app';
import company, { ICompanyState } from './company';
import user, { IUserState } from './manager/user';
import booking, { IBookingState } from './booking';
import manager from './manager/setting';
import feedback, { IFeedbackState } from './manager/feedback';
import offer, { IOfferState } from './manager/offer';
import menuManager, { IMenuManagerState } from 'store/reducers/manager/menu';
import menuApp, { MenuAppState } from 'store/reducers/menu/menu';

export interface IRootState {
    app: IAppState;
    company: ICompanyState;
    booking: IBookingState;
    menuManager: IMenuManagerState;
    menuApp: MenuAppState;
    feedback: IFeedbackState;
    offer: IOfferState;
    user: IUserState;
    manager: any;
}

export default combineReducers({
    app,
    company,
    user,
    booking,
    menuManager,
    menuApp,
    offer,
    manager,
    feedback,
});
