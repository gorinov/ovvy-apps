import {BaseResponse} from "./base.response";

export interface FeedbackInfo {
    id: number;
    rating: number;
    author: string;
    comment: string;
    time: number;
    unreliableCount: number;
    answer?: string;
}

export interface FeedbackResponse extends BaseResponse {
    data: FeedbackInfo[] | {
        message: string
    };
}