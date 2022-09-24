import {Environment, getEnv} from "./env";

const SENTRY_DSN: string = 'https://507a9fdae630483c8a1be2bb7589a364@o925854.ingest.sentry.io/5875102';

export class LogUtil {
    private static sentry: any;

    static debug(...data): void {
        if (!console && data[0] === '') {
            return;
        }

        if (getEnv() !== Environment.Development) {
            return;
        }

        console.log(...data);
    }

    static error(e: any): void {
        console.error('OV:', e);

        // если это эксепшон, шлём в sentry
        if (typeof e?.stack && e?.message) {
            this.sentry?.captureException(e);
        }
    }

    static async initSentry(): Promise<void> {
        if (getEnv() !== Environment.Production) {
            return;
        }

        if (this.sentry) {
            return;
        }

        const [Sentry, Integrations] = await Promise.all([import('@sentry/browser'), import('@sentry/tracing')]);

        Sentry.init({
            environment: getEnv(),
            dsn: SENTRY_DSN,
            integrations: [new Integrations.BrowserTracing()],
            tracesSampleRate: 0.2,
        });

        this.sentry = Sentry;
    }
}
