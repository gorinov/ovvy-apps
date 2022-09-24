import React, { useEffect, useRef, useState } from 'react';
import { MenuAppTypes, WayMode } from 'store/reducers/menu/menu';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import _ from 'lodash';
import { BasketItem } from 'model/dto/basket.item';
import { Quantity } from 'apps/menu/components/quantity';
import { Popup } from 'apps/menu/components/popup';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from 'images/icons/delete.svg';
import { CustomerInfo } from 'apps/menu/components/customer.info';
import { Confirm } from 'apps/menu/components/confirm';
import { DateUtil, IWorkingDay } from 'utils/date';
import { Metric } from 'utils/metric';

export enum BasketType {
    Default = 'default',
    Complete = 'complete',
    Check = 'check',
    Popup = 'popup',
}

export const Basket = ({
    loaded,
    orderUrl,
    qrcodeRef,
    closeAction,
    type = BasketType.Default,
}: {
    loaded?: boolean;
    type?: BasketType;
    qrcodeRef?: any;
    orderUrl?: string;
    closeAction?: () => void;
}) => {
    const customer = useSelector((state: IRootState) => state.app.customer);
    const menuState = useSelector((state: IRootState) => state.menuApp);
    const basket: BasketItem[] = menuState.basket;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const price = _.reduce(menuState.basket, (sum: number, basket: BasketItem) => sum + basket.item.price * basket.quantity, 0);
    const [clearPopup, setClearPopup] = useState(null);
    const clearPopupRef = useRef<any>();
    const title = loaded
        ? type == BasketType.Check
            ? 'Заказ'
            : 'Ваш заказ' + (type !== BasketType.Complete ? ' в ' + menuState.settings.name : '')
        : '';
    const [customerPopup, setCustomerPopup] = useState(null);
    const customerPopupRef = useRef<any>();
    const isUnavailableTime: boolean =
        customer.way === WayMode.Delivery &&
        menuState.settings?.deliveryTime &&
        DateUtil.isUnavailableTime(menuState.settings.deliveryTime);
    const deliveryTime: IWorkingDay = menuState.settings?.deliveryTime && DateUtil.getCurrentWorkingTime(menuState.settings.deliveryTime);
    const minPrice: number = menuState.settings?.minPrice;
    const isUnavailablePrice: boolean = customer.way === WayMode.Delivery && minPrice && price < minPrice;

    const order = () => {
        if (customer.way === WayMode.Restaurant || !menuState.settings.delivery) {
            navigate('/complete');
            Metric.reachGoal('order-restaurant');
        } else {
            if (customer.isValid) {
                navigate('/complete');
                Metric.reachGoal('order-delivery');
            } else {
                setCustomerPopup(true);
                Metric.reachGoal('open-customer-form');
                Metric.reachGoal('order-incorrect-customer');
            }
        }
    };

    useEffect(() => {
        if (!basket.length && closeAction) {
            closeAction();
        }
    }, [basket.length]);

    return (
        <div className={'ov-basket' + (type ? ' -' + type : '')}>
            {customerPopup && (
                <Popup
                    ref={customerPopupRef}
                    onClose={() => setCustomerPopup(null)}
                    content={<CustomerInfo onClose={() => customerPopupRef.current.close()} />}
                />
            )}

            {clearPopup && (
                <Popup
                    onClose={() => setClearPopup(null)}
                    ref={clearPopupRef}
                    content={
                        <Confirm
                            popupRef={clearPopupRef}
                            onConfirm={() => {
                                clearPopupRef.current.close();
                                dispatch({ type: MenuAppTypes.CLEAR });
                                navigate('/');

                                Metric.reachGoal('clear-basket');
                            }}
                        />
                    }
                />
            )}

            <div className="ov-basket__header">
                <h3 className="ov-basket__title">{title}</h3>
                {!!basket.length && (
                    <div className="ov-basket__control" onClick={() => setClearPopup(true)}>
                        <DeleteIcon className="ov-basket__control-icon" />
                    </div>
                )}
            </div>

            {!basket.length && (
                <div className="ov-basket__hint">
                    <div className="ov-basket__hint-text">
                        Выберите из меню и<br />
                        добавьте в заказ
                    </div>
                </div>
            )}

            {!!basket.length && (
                <div className="ov-basket__items">
                    {_.map(basket, (basketItem: BasketItem, index: number) => {
                        return (
                            <div className="ov-basket__item" key={index}>
                                <div className="ov-basket__item-name">{basketItem.item.name}</div>
                                {type != BasketType.Complete && type != BasketType.Check && (
                                    <div className="ov-basket__item-quantity">
                                        <Quantity
                                            onAdd={() =>
                                                dispatch({
                                                    type: MenuAppTypes.ADD_TO_BASKET,
                                                    payload: basketItem.item,
                                                })
                                            }
                                            onRemove={() =>
                                                dispatch({
                                                    type: MenuAppTypes.REMOVE_FROM_BASKET,
                                                    payload: basketItem.item,
                                                })
                                            }
                                            value={basketItem.quantity}
                                            modifier="basket"
                                        />
                                    </div>
                                )}
                                <div
                                    className={
                                        'ov-basket__item-price' + (type == BasketType.Check || type == BasketType.Complete ? ' -full' : '')
                                    }
                                >
                                    <div className="ov-order">
                                        <span className="ov-order__value">{basketItem.item.price}</span>
                                        <span className="ov-order__currency">₽</span>

                                        {(type == BasketType.Check || type == BasketType.Complete) && basketItem.quantity > 1 && (
                                            <span className="ov-order__quantity">
                                                <span>x</span> {basketItem.quantity}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {(type == BasketType.Check || type == BasketType.Complete) && !!basket.length && (
                        <div className="ov-basket__item -total">
                            <div className="ov-basket__item-name">Итого</div>

                            <div className="ov-basket__item-price">
                                <div className="ov-order">
                                    <span className="ov-order__value">{price}</span>
                                    <span className="ov-order__currency">₽</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!!basket.length && type != BasketType.Complete && type != BasketType.Check && (
                <div className="ov-basket__submit">
                    {!isUnavailablePrice && isUnavailableTime && (
                        <button className="ov-button -disabled">
                            <div>
                                Заказ на доставку можно оформить{' '}
                                <span>
                                    с {deliveryTime.open} до {deliveryTime.close}
                                </span>
                            </div>
                        </button>
                    )}
                    {!isUnavailablePrice && !isUnavailableTime && (
                        <button className="ov-button -submit" onClick={order}>
                            <span className="ov-button__text">Оформить заказ</span>
                            <div className="ov-button__order order">
                                <span className="ov-order__value">{price}</span>
                                <span className="ov-order__currency">₽</span>
                            </div>
                        </button>
                    )}
                    {isUnavailablePrice && (
                        <button className="ov-button -disabled">
                            <span className="ov-button__text"> Добавьте ещё на</span>
                            <div className="ov-button__order order">
                                <span className="ov-order__value">{minPrice - price}</span>
                                <span className="ov-order__currency">₽</span>
                            </div>
                        </button>
                    )}
                </div>
            )}

            {!!basket.length && type == BasketType.Complete && (
                <div className="ov-basket__confirm">
                    {orderUrl && (
                        <a className="ov-basket__confirm-link ov-link" target="_blank" href={orderUrl}>
                            Ссылка на Ваш заказ
                        </a>
                    )}

                    {orderUrl && (
                        <div className="ov-basket__qr">
                            <canvas ref={qrcodeRef}></canvas>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
