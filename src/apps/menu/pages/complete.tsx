import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BasketUtil } from 'utils/basket.util';
import { MenuActions } from 'store/actions/menu/menu';
import QRCode from 'qrcode';
import { LogUtil } from 'utils/log';
import { IAppState } from 'store/reducers/app';
import { IRootState } from 'store/reducers';
import { MenuAppState, MenuAppTypes, MenuMode, WayMode } from 'store/reducers/menu/menu';
import { Basket, BasketType } from 'apps/menu/components/basket';

export const CompletePage = () => {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const menuState: MenuAppState = useSelector((state: IRootState) => state.menuApp);
    const loaded: boolean = menuState.loaded && appState.loaded;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const qrcodeRef = useRef();

    useEffect(() => {
        if (menuState.orderUrl && qrcodeRef) {
            QRCode.toCanvas(
                qrcodeRef.current,
                menuState.orderUrl,
                {
                    margin: 2,
                    width: 200,
                },
                (e) => {
                    if (e) LogUtil.error(e);
                }
            );
        }
    }, [menuState.orderUrl, qrcodeRef, loaded]);

    useEffect(() => {
        dispatch({ type: MenuAppTypes.SET_MODE, payload: MenuMode.Check });
    }, []);

    useEffect(() => {
        if (!loaded) {
            return;
        }

        if (menuState.error) {
            return;
        }

        if (!menuState.basket.length) {
            navigate('/');
        } else {
            if (!menuState.orderUrl || menuState.orderHash != BasketUtil.getHash(menuState.basket)) {
                dispatch(MenuActions.saveOrder(menuState.settings.id, menuState.basket, appState.customer));
            }
        }
    }, [loaded]);

    return (
        <div className="ov-complete">
            {loaded && menuState.error && <div className="ov-message -error">{menuState.error}</div>}
            {loaded && !menuState.error && (
                <div className="ov-message -info">
                    {appState.customer.way === WayMode.Restaurant && 'Позовите официанта, чтобы сделать заказ'}
                    {appState.customer.way === WayMode.Delivery && menuState.settings.delivery && (
                        <>
                            {appState.customer.name}, ожидайте доставку по адресу {appState.customer.address}.<br />
                            {menuState.settings.phone && (
                                <>
                                    По вопросам доставки звоните по телефону{' '}
                                    <a className="ov-link -as-text" href={'tel:' + menuState.settings.phone.replace(/ /g, '')}>
                                        {menuState.settings.phone}
                                    </a>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {loaded && !menuState.error && (
                <Basket qrcodeRef={qrcodeRef} loaded={true} orderUrl={menuState.orderUrl} type={BasketType.Complete} />
            )}
        </div>
    );
};
