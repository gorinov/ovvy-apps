import {User} from "../../dto/user";
import {BaseResponse} from "../base.response";

export interface UserLoginResponse extends BaseResponse{
    data: User | {
        message: string;
    }
}