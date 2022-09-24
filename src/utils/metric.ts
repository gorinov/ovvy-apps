import { Environment, getEnv } from './env';
import { LogUtil } from 'utils/log';

export class Metric {
    static id: number;
    static instance = null;

    static loadYandex(id: number): Promise<any> {
        (function (m, e, t, r, i, k, a) {
            m[i] =
                m[i] ||
                function () {
                    (m[i].a = m[i].a || []).push(arguments);
                };
            m[i].l = Date.now();
            k = e.createElement(t);
            a = e.getElementsByTagName(t)[0];
            k.async = 1;
            k.src = r;
            a.parentNode.insertBefore(k, a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

        window.ym(id, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            triggerEvent: true,
        });

        return new Promise((resolve) => {
            document.addEventListener(`yacounter${id}inited`, () => {
                resolve(true);
            });
        });
    }

    static init(id: number) {
        if (getEnv() !== Environment.Production) {
            return;
        }

        if (this.instance) {
            LogUtil.debug(`Metric #${id} already inited`);
            return;
        }

        this.id = id;
        this.instance = this.loadYandex(id);
    }

    static reachGoal(targetName) {
        LogUtil.debug(`reachGoal ${targetName}`);

        if (getEnv() !== Environment.Production) {
            return;
        }

        if (!this.instance) {
            LogUtil.debug(`Metric not inited`);
            return;
        }

        this.instance.then(() => {
            window.ym(this.id, 'reachGoal', targetName);
        });
    }

    static hit(url) {
        LogUtil.debug(`hit ${url}`);

        if (getEnv() !== Environment.Production) {
            return;
        }

        if (!this.instance) {
            LogUtil.debug(`Metric not inited`);
            return;
        }

        this.instance.then(() => {
            window.ym(this.id, 'hit', url);
        });
    }
}
