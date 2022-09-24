import React from 'react';
import { MenuSettings } from 'model/dto/menu.settings';
import _ from 'lodash';

export const Info = ({ settings }: { settings: MenuSettings }) => {
    return (
        <div className="ov-info">
            <div className="ov-caption">Режим работы доставки</div>
            <div className="ov-info__time">
                {_.map(settings.deliveryTime, (item) => (
                    <div className="ov-info__row" key={item.index}>
                        <span className="ov-info__time-name">{item.label}</span>
                        <span className="ov-info__time-hours">
                            {item.open} - {item.close}
                        </span>
                    </div>
                ))}
            </div>

            <div className="ov-caption">Условия доставки</div>
            <div className="ov-info__text">
                <p>Доставка осуществляется при заказе на сумму от {settings.minPrice || 0}₽</p>
            </div>

            {settings.phone && <div className="ov-caption">Контактная информация</div>}
            {settings.phone && (
                <div className="ov-info__text">
                    <p>
                        Телефон{' '}
                        <a className="ov-link" href={'tel:' + settings.phone}>
                            {settings.phone}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};
