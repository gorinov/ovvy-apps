import {Response} from "./response";

export interface Delivery extends Response{
    number: string | null;
    saved: boolean;
}