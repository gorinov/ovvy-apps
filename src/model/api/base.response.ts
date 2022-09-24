import { StatusCode } from './statusCode';

export interface BaseResponse {
    status: StatusCode;
    data: any;
}
