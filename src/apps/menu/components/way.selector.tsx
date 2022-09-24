import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import ShopIcon from 'images/icons/shop.svg';
import ScooterIcon from 'images/icons/scooter.svg';
import { WayMode } from 'store/reducers/menu/menu';
import { Popup } from 'apps/menu/components/popup';
import React, { useRef, useState } from 'react';
import { CustomerInfo } from 'apps/menu/components/customer.info';
import { AppTypes } from 'store/reducers/app';
import { Customer } from 'model/dto/customer';
import { Vibration } from 'utils/vibration';
import { Metric } from 'utils/metric';

export enum WayState {
    Header = 'header',
    Menu = 'menu',
    Basket = 'basket',
}

export const WaySelector = ({ state }: { state: WayState }) => {
    const customer: Customer = useSelector((state: IRootState) => state.app.customer);
    const menuState = useSelector((state: IRootState) => state.menuApp);
    const dispatch = useDispatch();
    const [customerPopup, setCustomerPopup] = useState(null);
    const customerPopupRef = useRef<any>();

    if (!menuState.loaded || !menuState.settings.delivery) {
        return <></>;
    }

    const type: string = menuState.settings.type;
    const way: string = customer.way;

    const setWay = (way: WayMode) => {
        if (way === WayMode.Delivery) {
            Metric.reachGoal('open-customer-form');
            setCustomerPopup(true);
        }

        customer.way = way;
        Vibration.response();

        dispatch({ type: AppTypes.SET_CUSTOMER, payload: customer });
    };

    return (
        <div className={'ov-selector' + ' -' + state}>
            <div className="ov-selector__container">
                <button
                    className={'ov-button -selector' + (way === WayMode.Delivery ? ' -active' : '')}
                    onClick={() => setWay(WayMode.Delivery)}
                >
                    <ScooterIcon className="ov-button__icon"></ScooterIcon>
                    <span>Доставка</span>
                </button>

                <button
                    className={'ov-button -selector' + (way === WayMode.Restaurant ? ' -active' : '')}
                    onClick={() => setWay(WayMode.Restaurant)}
                >
                    <ShopIcon className="ov-button__icon"></ShopIcon>
                    <span>В {type}</span>
                </button>
            </div>

            <div className="ov-selector__hint">
                {way === WayMode.Delivery && customer.isValid && customer.address}
                {way === WayMode.Delivery && !customer.isValid && (
                    <span onClick={() => setWay(WayMode.Delivery)}>Для заказа заполните данные</span>
                )}
                {way === WayMode.Restaurant && 'Заказ примет официант'}
            </div>

            {customerPopup && (
                <Popup
                    ref={customerPopupRef}
                    onClose={() => setCustomerPopup(null)}
                    content={<CustomerInfo onClose={() => customerPopupRef.current.close()} />}
                />
            )}
        </div>
    );
};
