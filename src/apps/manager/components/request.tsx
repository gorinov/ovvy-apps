import React from 'react';
import { OrderItem } from 'model/dto/order.item';
import _ from 'lodash';
import { MenuRequest } from 'model/dto/menu.request';

const Request = ({ request }: { request: MenuRequest }) => {
    return (
        <div className="ov-request">
            <h3 className="ov-request__caption">Содержимое заказа</h3>
            <table className="ov-request__order">
                <thead>
                    <tr className="ov-request__order-item -header">
                        <th className="ov-request__order-number">#</th>
                        <th className="ov-request__order-name">Название</th>
                        <th className="ov-request__order-price">Цена</th>
                        <th className="ov-request__order-quantity">Кол-во</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(request.order, (item: OrderItem, i: number) => {
                        return (
                            <tr className="ov-request__order-item" key={i}>
                                <td className="ov-request__order-number">{i + 1})</td>
                                <td className="ov-request__order-name">{item.name}</td>
                                <td className="ov-request__order-price">{item.price}р.</td>
                                <td className="ov-request__order-quantity">{item.quantity}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <h3 className="ov-request__caption">Данные заказчика</h3>
            <div className="ov-request__customer">
                <div className="ov-request__customer-item">
                    <span>Имя:</span>
                    <span>{request.customer.name}</span>
                </div>
                <div className="ov-request__customer-item">
                    <span>Телефон:</span>
                    <span>
                        <a className="ov-link" href={'tel:' + request.customer.phone}>
                            {request.customer.phone}
                        </a>
                    </span>
                </div>
                <div className="ov-request__customer-item">
                    <span>Адрес:</span>
                    <span>{request.customer.address}</span>
                </div>

                {request.customer.entrance && (
                    <div className="ov-request__customer-item">
                        <span>Подъезд:</span>
                        <span>{request.customer.entrance}</span>
                    </div>
                )}

                {request.customer.floor && (
                    <div className="ov-request__customer-item">
                        <span>Этаж:</span>
                        <span>{request.customer.floor}</span>
                    </div>
                )}

                {request.customer.apartment && (
                    <div className="ov-request__customer-item">
                        <span>Квартира:</span>
                        <span>{request.customer.apartment}</span>
                    </div>
                )}

                {request.customer.intercom && (
                    <div className="ov-request__customer-item">
                        <span>Домофон:</span>
                        <span>{request.customer.intercom}</span>
                    </div>
                )}

                {request.customer.comment && (
                    <div className="ov-request__customer-item">
                        <span>Комментарий:</span>
                        <span>{request.customer.comment}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Request;
