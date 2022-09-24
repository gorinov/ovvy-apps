import {User} from "../../dto/user";
import {BaseResponse} from "../base.response";

export interface UserCreateResponse extends BaseResponse{
    data: User | {
        message: string;
    }
}