import React, { useEffect } from 'react';
import '../../styles/menu/main.scss';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MenuPage } from 'apps/menu/pages/menu';
import { MenuAppState } from 'store/reducers/menu/menu';
import { IRootState } from 'store/reducers';
import { IAppState } from 'store/reducers/app';
import { CompletePage } from 'apps/menu/pages/complete';
import { MenuActions } from 'store/actions/menu/menu';
import { Config } from 'services/config';
import { Header } from 'apps/menu/components/header';
import Loader from 'components/loader';
import { CheckPage } from 'apps/menu/pages/check';
import { Metric } from 'utils/metric';
import { HtmlUtil } from 'utils/html';
import { MenuTheme } from 'model/enum/core';
import { IOfferState } from 'store/reducers/manager/offer';
import { OfferActions } from 'store/actions/offer';

function MenuApp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const configId: number = Config.getInstance().menuId;
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const menuState: MenuAppState = useSelector((state: IRootState) => state.menuApp);
    const offerState: IOfferState = useSelector((state: IRootState) => state.offer);
    const location = useLocation();

    useEffect(() => {
        Metric.init(89234138);
    }, []);

    React.useEffect(() => {
        Metric.hit(location.pathname);
    }, [location]);

    useEffect(() => {
        if (!configId) {
            document.title = 'Возникла проблемка';
        }

        if (!offerState.loaded) {
            dispatch(OfferActions.getByMenu(configId));
        }

        if (!menuState.loaded) {
            dispatch(MenuActions.getSettings(configId, Config.getInstance().orderId));
        } else {
            window.addEventListener(
                'message',
                (e) => {
                    if (e.origin !== 'https://menu.ovvy.ru') {
                        return;
                    }

                    if (e.data.action !== 'setTheme') {
                        return;
                    }

                    HtmlUtil.setCSSVars(null);

                    switch (e.data.theme) {
                        case 'dark':
                            HtmlUtil.setCSSVars(MenuTheme.dark);
                            break;
                        case 'blue':
                            HtmlUtil.setCSSVars(MenuTheme.blue);
                            break;
                        default:
                            break;
                    }
                },
                false
            );

            if (menuState.settings.style) {
                HtmlUtil.setCSSVars(menuState.settings.style);
            }

            if (menuState.orderHash) {
                navigate('/complete');
            }
        }
    }, [menuState.loaded]);

    if (!configId || (menuState.loaded && !menuState.settings)) {
        return (
            <div className="ov -menu">
                <div className="ov-message -error">
                    <div>
                        <b>Возникла проблемка</b>
                    </div>
                    {!configId ? 'Не указан идентификатор конфигурации "menuId"' : menuState.error}
                </div>
            </div>
        );
    }

    return (
        <div className={'ov -menu' + (!menuState.loaded ? ' -loading' : '')}>
            <Loader />
            <Header loaded={menuState.loaded} mode={menuState.mode} settings={menuState.settings} />
            <Routes>
                <Route path="/complete" element={<CompletePage />} />

                <Route
                    path="*"
                    element={
                        Config.getInstance().orderId ? (
                            <CheckPage loaded={menuState.loaded && appState.loaded} basket={menuState.basket} />
                        ) : (
                            <MenuPage settings={menuState.settings} basket={menuState.basket} />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default MenuApp;
