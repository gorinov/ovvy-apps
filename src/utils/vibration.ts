export class Vibration {
    public static response() {
        const supportsVibrate: boolean = 'vibrate' in navigator;

        if (supportsVibrate) {
            window.navigator.vibrate(10);
        }
    }
}
