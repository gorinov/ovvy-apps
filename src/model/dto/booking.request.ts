export class BookingRequest {
    id: number;
    createdDate: Date;
    email: string = '';
    phone: string = '';
    guests: number;
    name: string;
    date: Date;
    time: string;
    wish: string = '';
}