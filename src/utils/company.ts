export class CompanyUtil {
    static needUpdate(timestamp1?: number, timestamp2?: number): boolean {
        if (!timestamp1 || !timestamp2) {
            return true;
        }

        return timestamp1 !== timestamp2;
    }
}