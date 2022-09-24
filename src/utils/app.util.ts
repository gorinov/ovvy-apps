import { AppTypes, SnackbarMessage, SnackbarMessageKind } from 'store/reducers/app';
import store from 'store/store';

export class AppUtil {
    static showSuccessSnackbar(message: string): void {
        store.dispatch({
            type: AppTypes.SHOW_SNACKBAR,
            payload: new SnackbarMessage(SnackbarMessageKind.Success, message),
        });
    }

    static downloadBase64File(base64, fileName) {
        const link = document.createElement('a');

        document.body.appendChild(link);

        link.setAttribute('href', base64);
        link.setAttribute('download', fileName);
        link.click();
    }

    static setTitle(text: string): void {
        document.title = text + ' | OVVY';
    }

    static showErrorSnackbar(message: string): void {
        store.dispatch({
            type: AppTypes.SHOW_SNACKBAR,
            payload: new SnackbarMessage(SnackbarMessageKind.Error, message),
        });
    }

    static handleChange(e: any, setter: (prevValue) => void): void {
        const [name, value] = AppUtil.getNameValue(e);

        setter((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    }

    static getNameValue(e: any): [string, any] {
        let name: string = e.target.name,
            value: any = e.target.value;

        if (value === 'switch') {
            value = e.target.checked;
        }

        return [name, value];
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    }
}
