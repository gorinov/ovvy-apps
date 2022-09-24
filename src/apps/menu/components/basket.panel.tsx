import React, { useState } from 'react';
import _ from 'lodash';
import { BasketItem } from 'model/dto/basket.item';
import { Popup } from 'apps/menu/components/popup';
import { Basket, BasketType } from 'apps/menu/components/basket';
import { Metric } from 'utils/metric';

export const BasketPanel = ({ basket }) => {
    const price = _.reduce(basket, (sum: number, basket: BasketItem) => sum + basket.item.price * basket.quantity, 0);
    const [basketPopup, setBasketPopup] = useState(null);

    return (
        <div className={'ov-basket-panel' + (basket.length ? ' -show' : '')}>
            {basketPopup && (
                <Popup
                    onClose={() => setBasketPopup(null)}
                    content={
                        <Basket
                            loaded={true}
                            type={BasketType.Popup}
                            closeAction={() => {
                                setBasketPopup(null);
                            }}
                        />
                    }
                />
            )}
            <button
                className="ov-button -submit"
                onClick={() => {
                    setBasketPopup(true);
                    Metric.reachGoal('open-mobile-basket');
                }}
            >
                <span className="ov-button__text">Заказ</span>

                <div className="ov-button__order order">
                    <span className="ov-order__value">{price}</span>
                    <span className="ov-order__currency">₽</span>
                </div>
            </button>
        </div>
    );
};
