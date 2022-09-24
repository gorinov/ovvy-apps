export interface DeliveryInfo {
    saved: boolean,
    delivery: {
        number: string
    },
    notificationSent: boolean,
    notificationUpdated: boolean,
    error: string,
    code: string
}