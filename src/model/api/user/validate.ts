import {StatusCode} from "../statusCode";
import {User} from "../../dto/user";

export interface UserValidateResponse {
    data: User,
    status: StatusCode
}