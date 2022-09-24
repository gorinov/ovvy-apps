import { KeyValuePair } from 'model/enum/core';
import _ from 'lodash';

export class HtmlUtil {
    static addMeta(name, content) {
        let metaTag: HTMLMetaElement = document.querySelector(`meta[name='${name}']`);

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = name;
            document.querySelector('head').appendChild(metaTag);
        }

        metaTag.content = content;
    }

    static setCSSVars(vars: KeyValuePair): void {
        if (!vars) {
            document.documentElement.removeAttribute('style');
            return;
        }

        _.each(vars, (value: string, key: string) => {
            document.documentElement.style.setProperty(`--${key}`, value);
        });
    }
}
