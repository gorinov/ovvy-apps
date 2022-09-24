import {BookingConfirm} from "../model/dto/booking.confirm";
import {BookingConfirmInfo} from "../model/api/booking.checkout";

export class BookingConfirmBuilder {
    static build(bookingInfo: BookingConfirmInfo): BookingConfirm {
        let booking: BookingConfirm = new BookingConfirm();

        booking.number = bookingInfo.number;

        if (bookingInfo.message) {
            booking.message = bookingInfo.message;
        }

        return booking;
    }
}
