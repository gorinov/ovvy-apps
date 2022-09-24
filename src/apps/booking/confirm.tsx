import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {IRootState} from "../../store/reducers";
import CheckIcon from 'images/check.svg';
import {Navigate, useNavigate} from 'react-router-dom';
import {BookingTypes} from "../../store/reducers/booking";
import {BookingConfirm} from "../../model/dto/booking.confirm";

export default function Confirm() {
    const bookingConfirm: BookingConfirm = useSelector((state: IRootState) => state.booking.confirm),
        dispatch = useDispatch(),
        navigate = useNavigate();

    const toMain = (): void => {
        dispatch({type: BookingTypes.BOOKING_CLEAR});
        navigate('/');
    };

    return (
        bookingConfirm?.number ?
            <div className="ov-confirm">
                <div className="ov-confirm__header">
                    <CheckIcon className="ov-confirm__header-icon -success"/>

                    <div className="ov-confirm__header-message">
                        Ваша заявка #{bookingConfirm.number} принята!
                    </div>
                </div>

                {bookingConfirm.message &&
                <div className="ov-confirm__text" dangerouslySetInnerHTML={{__html: bookingConfirm.message}}>
                </div>}

                <div className="ov-confirm__link">
                    <span className="ov-link" onClick={toMain}>Забронировать ещё</span>
                </div>
            </div>
            : <Navigate to="/"/>

    );
};