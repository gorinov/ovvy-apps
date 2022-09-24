import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Basket, BasketType } from 'apps/menu/components/basket';

export const CheckPage = ({ basket, loaded }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!loaded) {
            return;
        }

        if (!basket.length) {
            navigate('/');
        }
    }, [loaded]);

    return <div className="ov-check">{loaded && <Basket loaded={true} type={BasketType.Check} />}</div>;
};
