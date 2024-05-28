import {User} from "./user/user";

export interface Parent {
    user_id ?: string,
    id ?: string,
    name ? : string,
    surname ? : string,
    phone_number ? : string,
    user ? : User
}
