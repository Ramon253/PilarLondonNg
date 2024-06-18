export interface User {
    id : string,
    email : string,
    name : string,
    password : string,
    role ?: string
    profile_photo? : string,
    email_verified_at? : string,
}
