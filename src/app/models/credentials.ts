export interface Credentials {
    name?: string,
    email?: string,
    password: string,
    password_confirmation?: string,
    remember_me? : boolean
}
