import {User} from "./user";

export interface UserResponse {
    error?: string,
    success?: string,
    user : User
}
