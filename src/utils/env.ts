export enum Environment {
    Production = 'production',
    Development = 'development'
}

declare const ENVIRONMENT: Environment;

export function getEnv(): Environment {
    return ENVIRONMENT;
}