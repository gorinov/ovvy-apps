import {User} from "../../dto/user";
import {BaseResponse} from "../base.response";

export interface UserUpdateResponse extends BaseResponse{
    data: User | {
        message: string;
    }
}