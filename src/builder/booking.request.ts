import _ from 'lodash'
import {BookingRequestInfo} from "../model/api/booking.request";
import {BookingRequest} from "../model/dto/booking.request";

export class BookingRequestBuilder {
    static build(bookingRequestInfo: BookingRequestInfo): BookingRequest {
        let bookingRequest: BookingRequest = new BookingRequest();

        bookingRequest.id = bookingRequestInfo.id;

        if (!_.isUndefined(bookingRequestInfo.email)) {
            bookingRequest.email = bookingRequestInfo.email;
        }

        if (!_.isUndefined(bookingRequestInfo.phone)) {
            bookingRequest.phone = bookingRequestInfo.phone;
        }

        bookingRequest.name = bookingRequestInfo.name;
        bookingRequest.createdDate = new Date(bookingRequestInfo.createdDate * 1000);
        bookingRequest.date = new Date(bookingRequestInfo.date * 1000);
        bookingRequest.time = bookingRequestInfo.time;
        bookingRequest.guests = bookingRequestInfo.guests;
        bookingRequest.wish = bookingRequestInfo.wish;

        return bookingRequest;
    }
}
