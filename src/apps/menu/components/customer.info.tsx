import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppUtil } from 'utils/app.util';
import { AppTypes, IAppState } from 'store/reducers/app';
import { IRootState } from 'store/reducers';
import InputMask from 'react-input-mask';
import { AddressInput } from 'components/address.input';
import { FormField } from 'model/enum/form';
import { Customer } from 'model/dto/customer';
import { KeyValuePair } from 'model/enum/core';
import { MenuAppState } from 'store/reducers/menu/menu';
import { DateUtil, IWorkingDay } from 'utils/date';
import _ from 'lodash';
import { City } from 'model/dto/menu.settings';

export const CustomerInfo = ({ onClose }) => {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const menuState: MenuAppState = useSelector((state: IRootState) => state.menuApp);
    const [customer, setCustomer] = useState<KeyValuePair>(appState.customer);
    const dispatch = useDispatch();
    const [focusableField, setFocusableField] = useState(null);
    const addressRef = useRef(null);
    const deliveryTime: IWorkingDay = DateUtil.getCurrentWorkingTime(menuState.settings.deliveryTime);
    const isUnavailableTime: boolean = DateUtil.isUnavailableTime(menuState.settings.deliveryTime);
    const cityList: City[] = menuState.settings.city;

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch({ type: AppTypes.SET_CUSTOMER, payload: new Customer(customer) });

        onClose?.();
    };

    const onChange = (e) => {
        AppUtil.handleChange(e, setCustomer);
    };

    const onFocus = (e, field: FormField) => {
        setFocusableField(field);
    };

    const onBlur = () => {
        setFocusableField(null);

        setTimeout(() => {
            addressRef.current?.clearHint();
        }, 100);
    };

    const isFilled = (field: FormField) => {
        return !!customer?.[field] || focusableField === field || (field === FormField.Address && addressRef.current?.addressOnProcess());
    };

    const messages: any = [];
    if (isUnavailableTime) {
        messages.push(`Принимает заказы на доставку с ${deliveryTime.open} до ${deliveryTime.close}`);
    }
    if (cityList.length) {
        if (messages.length) {
            messages.push(<br />);
        }
        messages.push(`Доставка осуществляется в ${_.map(cityList, (city) => city.type + ' ' + city.name).join(', ')}`);
    }

    return (
        <div className="ov-customer">
            <div className="ov-caption">Данные для доставки</div>

            {messages && <div className="ov-customer__message ov-message -info -popup">{messages}</div>}

            <form className="ov-form" onSubmit={handleSubmit}>
                <div className="ov-form__row">
                    <div className="ov-form__field">
                        <label htmlFor={FormField.Name} className={'ov-form__label' + (isFilled(FormField.Name) ? ' -filled' : '')}>
                            Ваше имя
                        </label>

                        <input
                            className="ov-form__control"
                            type="text"
                            name={FormField.Name}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Name)}
                            onBlur={onBlur}
                            value={customer.name}
                            required
                        />
                    </div>

                    <div className="ov-form__field">
                        <label htmlFor={FormField.Phone} className={'ov-form__label' + (isFilled(FormField.Phone) ? ' -filled' : '')}>
                            Телефон для связи
                        </label>

                        <InputMask
                            name={FormField.Phone}
                            type="tel"
                            className="ov-form__control"
                            mask={!!customer.phone ? '+9 999 999 9999' : null}
                            placeholder={isFilled(FormField.Phone) ? '+_ ___ ___ ____' : ''}
                            value={customer.phone}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Phone)}
                            onBlur={onBlur}
                            required
                        ></InputMask>
                    </div>
                </div>

                <div className="ov-form__row">
                    <div className="ov-form__field">
                        <AddressInput
                            rootRef={addressRef}
                            value={customer.address}
                            setValue={(value) => {
                                setCustomer((prev) => ({
                                    ...prev,
                                    [FormField.Address]: value,
                                }));
                            }}
                            isFilled={isFilled}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            cityIds={_.map(cityList, (city) => city.id)}
                        />
                    </div>
                </div>

                <div className="ov-form__row -address">
                    <div className="ov-form__field">
                        <label htmlFor={FormField.Entrance} className={'ov-form__label' + (isFilled(FormField.Entrance) ? ' -filled' : '')}>
                            Подъезд
                        </label>
                        <input
                            className="ov-form__control"
                            type="number"
                            name={FormField.Entrance}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Entrance)}
                            onBlur={onBlur}
                            value={customer.entrance}
                        />
                    </div>

                    <div className="ov-form__field">
                        <label htmlFor={FormField.Intercom} className={'ov-form__label' + (isFilled(FormField.Intercom) ? ' -filled' : '')}>
                            Домофон
                        </label>
                        <input
                            className="ov-form__control"
                            type="text"
                            name={FormField.Intercom}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Intercom)}
                            onBlur={onBlur}
                            value={customer.intercom}
                        />
                    </div>

                    <div className="ov-form__field">
                        <label htmlFor="floor" className={'ov-form__label' + (isFilled(FormField.Floor) ? ' -filled' : '')}>
                            Этаж
                        </label>
                        <input
                            className="ov-form__control"
                            type="number"
                            name={FormField.Floor}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Floor)}
                            onBlur={onBlur}
                            value={customer.floor}
                        />
                    </div>

                    <div className="ov-form__field">
                        <label
                            htmlFor={FormField.Apartment}
                            className={'ov-form__label' + (isFilled(FormField.Apartment) ? ' -filled' : '')}
                        >
                            Квартира
                        </label>
                        <input
                            className="ov-form__control"
                            type="number"
                            name={FormField.Apartment}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Apartment)}
                            onBlur={onBlur}
                            value={customer.apartment}
                        />
                    </div>
                </div>

                <div className="ov-form__row">
                    <div className="ov-form__field">
                        <label htmlFor={FormField.Comment} className="ov-form__label -textarea">
                            Комментарий
                        </label>
                        <textarea
                            className="ov-form__control -textarea"
                            name={FormField.Comment}
                            onChange={onChange}
                            onFocus={(e) => onFocus(e, FormField.Comment)}
                            onBlur={onBlur}
                            value={customer.comment}
                        />
                    </div>
                </div>

                <div className="ov-form__row -submit">
                    <div className="ov-form__field">
                        <button type="submit" className="ov-button -default">
                            Подтвердить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
