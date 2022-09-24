import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Core } from 'model/enum/core';
import { Config } from 'services/config';
import { HtmlUtil } from 'utils/html';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { LogUtil } from 'utils/log';
import './utils/browser.api.util';
import store from 'store/store';
import { App } from 'services/app';

const CreateCompanyFormApp = React.lazy(() => import('./apps/create-company'));
const BookingApp = React.lazy(() => import('./apps/booking'));
const ManagerApp = React.lazy(() => import('./apps/manager'));
const MenuApp = React.lazy(() => import('./apps/menu'));

declare global {
    interface AppParams {
        component: Core;
        provider: number;
        menuId: number;
        orderId: string;
        container: string;
    }

    interface Window {
        ym: any;
        companyData: any;
        ovvy: {
            cityID: number;
            apps: any;
        };
    }

    interface Date {
        ovIsEqualDate(other: Date): boolean;
        ovDiffInDays(other: Date): number;
        ovDiffInMonths(other: Date): number;
        ovResetTime(): Date;
        ovSetMaxTime(): Date;
        ovResetDate(): Date;
        ovAddMinutes(count: number): Date;
        ovAddDays(count: number): Date;
        ovAddMonths(count: number): Date;
        ovAddYears(count: number): Date;
        ovFormat(format: string): string;
        ovClone(): Date;
    }
}

const ovvy = window.ovvy;

if (ovvy && ovvy.apps) {

    LogUtil.initSentry();

    const initComponent = (appParams) => {
        let element = document.getElementById(appParams.container);

        if (!element) {
            throw new Error(`Element "#${appParams.container}" not found`);
        }

        if (!Object.values(Core).includes(appParams.component)) {
            throw new Error(`Component "${appParams.component}" does not exist`);
        }

        const config = Config.getInstance();

        config.init(appParams);

        const app: App = App.getInstance();

        HtmlUtil.addMeta('viewport', 'width=device-width, initial-scale=1');

        ReactDOM.render(
            <React.StrictMode>
                <>
                    <Suspense fallback={<div />}>
                        {config.component === Core.Manager && (
                            <BrowserRouter basename={'/manager'}>
                                <Provider store={store}>
                                    <ManagerApp />
                                </Provider>
                            </BrowserRouter>
                        )}

                        {config.component === Core.Booking && (
                            <HashRouter>
                                <Provider store={store}>
                                    <BookingApp />
                                </Provider>
                            </HashRouter>
                        )}

                        {config.component === Core.CreateCompanyForm && (
                            <HashRouter>
                                <Provider store={store}>
                                    <CreateCompanyFormApp />
                                </Provider>
                            </HashRouter>
                        )}

                        {config.component === Core.Menu && (
                            <HashRouter>
                                <Provider store={store}>
                                    <MenuApp />
                                </Provider>
                            </HashRouter>
                        )}
                    </Suspense>
                </>
            </React.StrictMode>,
            element
        );
    }

    ovvy.apps.forEach((appParams: AppParams) => {
        initComponent(appParams);
    });
    ovvy.apps.push = (appParams) => initComponent(appParams);

} else {
    throw Error(`Ovvy apps is empty`);
}
