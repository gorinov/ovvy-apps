import { BaseApi } from 'services/api/base.api';
import _ from 'lodash';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { FormField } from 'model/enum/form';
import { KeyValuePair } from 'model/enum/core';

export const AddressInput = ({
    rootRef,
    value,
    setValue,
    isFilled,
    onFocus,
    onBlur,
    cityIds,
}: {
    rootRef: any;
    value: string;
    setValue: any;
    isFilled?: any;
    onFocus?: any;
    onBlur?: any;
    cityIds?: number[];
}) => {
    const [address, setAddress] = useState(value);
    const [addressHint, setAddressHint] = useState([]);
    const addressValid = useRef(!!value);
    const addressNotFull = useRef(false);
    const addressInput = useRef(null);

    useImperativeHandle(rootRef, () => ({
        addressOnProcess() {
            return address && addressNotFull.current;
        },
        clearHint() {
            setAddressHint([]);
        },
    }));

    const selectAddress = (address: KeyValuePair) => {
        const value = address.value;

        setAddress(value);
        setAddressHint([]);

        if (address.data.house) {
            addressNotFull.current = false;
            addressValid.current = true;
            setValue(value);
            addressInput.current.setCustomValidity('');
        } else {
            addressInput.current.setCustomValidity('Не указан дом');
            addressNotFull.current = true;
            addressValid.current = false;
        }
    };

    const getAddress = (value: string) => {
        BaseApi.getAddress(value, cityIds).then((result) => {
            setAddressHint(result);
        });
    };

    return (
        <>
            <label htmlFor={FormField.Address} className={'ov-form__label' + (isFilled?.(FormField.Address) ? ' -filled' : '')}>
                Адрес доставки
            </label>

            <input
                ref={addressInput}
                className="ov-form__control"
                type="text"
                autoComplete="off"
                name={FormField.Address}
                required
                onChange={(e) => {
                    const value = e.target.value;

                    getAddress(value);
                    setAddress(value);

                    addressValid.current = false;
                }}
                onFocus={(e) => {
                    const value = e.target.value;
                    onFocus?.(e, FormField.Address);

                    getAddress(value);
                }}
                onBlur={(e) => {
                    setTimeout(() => {
                        if (!addressValid.current && !addressNotFull.current) {
                            setAddress(value);
                        }
                    }, 150);

                    onBlur?.(e);
                }}
                value={address}
            />

            {addressHint.length > 0 && (
                <ul className="ov-form__option">
                    {_.map(addressHint, (item, i) => (
                        <li key={i} className="ov-form__option-item" onClick={() => selectAddress(item)}>
                            {item.value}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};
