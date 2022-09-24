import React from 'react';
import Price from 'components/price';
import { Quantity } from 'apps/menu/components/quantity';
import { WeightUnit, weightUnitNames } from 'model/enum/core';
import DrinkIcon from '../../../images/icons/drink.svg';
import FoodIcon from '../../../images/icons/food.svg';

type CardProps = {
    id?: number;
    name?: string;
    description?: string;
    note?: string;
    enabled?: boolean;
    image?: string;
    priceAfterDiscount?: number;
    priceBeforeDiscount?: number;
    weight?: number;
    calories?: number;
    weightUnit?: WeightUnit;
    onClick?: () => void;
    quantity?: number;
    addToBasket?: () => void;
    removeFromBasket?: () => void;
    isLoading?: boolean;
    type?: string;
};

export const Card = ({
    type,
    name,
    description,
    image,
    priceAfterDiscount,
    priceBeforeDiscount,
    quantity,
    weight,
    weightUnit,
    calories,
    enabled,
    onClick,
    addToBasket,
    removeFromBasket,
    isLoading,
}: CardProps) => {
    return (
        <div
            className={'ov-card' + (type ? ' -' + type : quantity > 0 ? ' -selected' : '') + (enabled ? '' : ' -disabled')}
            onClick={onClick}
        >
            {!isLoading && (
                <div className="ov-card__image">
                    {!image && (
                        <>
                            {weightUnit === WeightUnit.Ml ? (
                                <DrinkIcon className="ov-card__image-placeholder" />
                            ) : (
                                <FoodIcon className="ov-card__image-placeholder" />
                            )}
                        </>
                    )}
                    {image && <img src={image} alt={name} />}
                    {!enabled && <div className="ov-card__image-disabled">Временно недоступно для заказа</div>}
                </div>
            )}
            {isLoading && <div className="ov-card__image"></div>}

            <div className="ov-card__wrapper">
                <div className="ov-card__content">
                    <div className="ov-card__header">
                        <span className="ov-card__title">{name}</span>
                        <span className="ov-card__properties">
                            {!!weight && (
                                <span className="ov-card__weight">
                                    {weight} {weightUnitNames[weightUnit]}
                                </span>
                            )}

                            {!!weight && !!calories && <span className="ov-card__delimiter">/</span>}
                            {!!calories && <span className="ov-card__calories">{calories} кКал</span>}
                        </span>
                    </div>

                    <div className="ov-card__description">{description && <div className="ov-card__text">{description}</div>}</div>
                </div>

                <div className="ov-card__order">
                    <div className="ov-card__price">
                        {!!priceBeforeDiscount && (
                            <Price priceAfterDiscount={priceAfterDiscount} priceBeforeDiscount={priceBeforeDiscount} currency={'₽'} />
                        )}
                    </div>
                    {addToBasket && enabled && (
                        <div className="ov-card__button">
                            {quantity > 0 ? (
                                <Quantity value={quantity} onAdd={addToBasket} onRemove={removeFromBasket} />
                            ) : (
                                <div className="ov-button -default" onClick={addToBasket}>
                                    <span>Добавить</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
