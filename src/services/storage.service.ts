export class StorageService {
    static remove(key: string) {
        localStorage.removeItem(key);
    }

    static push(key: string, content: any) {
        localStorage.setItem(key, JSON.stringify(content));
    }

    static get(key: string) {
        try {
            const content: string = localStorage.getItem(key);

            return JSON.parse(content);
        } catch (e) {
            this.remove(key);

            return null;
        }
    }
}