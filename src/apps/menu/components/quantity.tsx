import React from 'react';
import PlusIcon from 'images/plus.svg';
import MinusIcon from 'images/minus.svg';

type QuantityProps = {
    onAdd: () => void;
    onRemove: () => void;
    value: number;
    modifier?: string;
};

export const Quantity = ({ onAdd, onRemove, value, modifier = 'default' }: QuantityProps) => {
    return (
        <div className={`ov-quantity -${modifier}`}>
            <div className="ov-quantity__container">
                <button className="ov-quantity__plus ov-button -stepper" onClick={onRemove}>
                    <MinusIcon className="ov-button__icon" />
                </button>
                <div className="ov-quantity__value">{value}</div>
                <button className="ov-quantity__minus ov-button -stepper" onClick={onAdd}>
                    <PlusIcon className="ov-button__icon" />
                </button>
            </div>
        </div>
    );
};
