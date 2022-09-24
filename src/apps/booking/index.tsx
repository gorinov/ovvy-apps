import React, { useEffect, useState } from 'react';
import CheckOutBooking from './checkout';
import { AppTypes, IAppState } from '../../store/reducers/app';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import Loader from '../../components/loader';
import { Config } from '../../services/config';
import Confirm from './confirm';
import { BookingActions } from '../../store/actions/booking';
import { BookingTypes, IBookingState } from '../../store/reducers/booking';
import '../../styles/booking/main.scss';
import { IRootState } from '../../store/reducers';
import { BookingApi } from '../../services/api/booking.api';
import { BookingCheckOutResponse } from '../../model/api/booking.checkout';
import { StatusCode } from '../../model/api/statusCode';
import { BookingConfirmBuilder } from '../../builder/booking.confirm';
import { BookingConfirm } from '../../model/dto/booking.confirm';

export default function BookingApp() {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const bookingState: IBookingState = useSelector((state: IRootState) => state.booking);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!bookingState.settingsLoaded) {
            dispatch(BookingActions.getSettings(Config.getInstance().provider));
        } else {
            if (!bookingState.settings.active) {
                setErrorMessage('Форма бронирования отключена');
            }
        }

        if (bookingState.confirm) {
            navigate('/confirm');
        }
    }, [bookingState.settingsLoaded]);

    const onCheckOut = async () => {
        dispatch({ type: AppTypes.LOADING });

        const storeData: IRootState = store.getState();
        const data = {
            providerId: Config.getInstance().provider,
            userData: storeData.user.guest,
        };

        const response: BookingCheckOutResponse = await BookingApi.checkOut(data);

        if (response.status === StatusCode.Success) {
            const bookingConfirm: BookingConfirm = BookingConfirmBuilder.build(response.data);
            dispatch({ type: BookingTypes.BOOKING_CHECKOUT, payload: bookingConfirm });

            navigate('/confirm');
        } else {
            setErrorMessage(response.data.message);
        }

        dispatch({ type: AppTypes.LOADED });
    };

    return (
        <div className="ov -booking">
            <Loader />
            {appState.loaded && errorMessage && <div className="ov-alert">{errorMessage}</div>}

            {appState.loaded && !errorMessage && (
                <Routes>
                    <Route path="/" element={<CheckOutBooking onSubmit={onCheckOut} />} />
                    <Route path="/confirm" element={<Confirm />} />
                </Routes>
            )}
        </div>
    );
}
