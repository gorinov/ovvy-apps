export enum Core {
    Booking = 'booking',
    Delivery = 'delivery',
    Menu = 'menu',
    Manager = 'manager',
    CreateCompanyForm = 'create-company-form',
}

export enum WeightUnit {
    Gram,
    Kilogram,
    Ml,
    Piece,
}

export type KeyValuePair = {
    [key: string]: any;
};

export const weightUnitNames = ['гр.', 'кг.', 'мл.', 'шт.'];

export const MenuTheme = {
    dark: {
        'bg-color': '#222',
        'card-bg-color': '#222',
        'card-image-bg-color': '#444',
        'content-bg-color': '#333',
        'font-color': '#eee',
        'title-font-color': '#eee',
        'border-color': '#424242',
        'button-stepper-bg-color': '#444',
        'button-stepper-hover-bg-color': '#555',
        'button-stepper-color': '#eee',
        'primary-color': '#ff8720',
        'button-bg-color': '#ff8720',
        'button-bg-hover-color': '#e57413',
        'secondary-color': '#eee',
        'navigation-bg-active-color': '#444',
        'navigation-bg-hover-color': '#555',
        'navigation-font-color': '#fff',
        'navigation-font-active-color': '#fff',
        'navigation-font-hover-color': '#fff',
        'popup-overlay-bg-color': '#fff',
    },
    blue: {
        'bg-color': '#dbebf1',
        'card-bg-color': '#fff',
        'card-image-bg-color': '#dbebf1',
        'content-bg-color': '#e9f3f7',
        'card-text-font-color': '#0f5165',
        'font-color': '#0f5165',
        'title-font-color': '#0f5165',
        'border-color': '#cbe0e8',
        'button-stepper-bg-color': '#2195b9',
        'button-stepper-hover-bg-color': '#1A4D80',
        'button-stepper-color': '#fff',
        'primary-color': '#f15c39',
        'button-bg-color': '#f15c39',
        'button-bg-hover-color': '#e14e2c',
        'navigation-bg-active-color': '#2295ba',
        'navigation-bg-hover-color': '#c6dce5',
        'navigation-font-color': '#0f5165',
        'navigation-font-active-color': '#fff',
        'navigation-font-hover-color': '#fff',
        'secondary-color': '#0f5165',
    },
};
