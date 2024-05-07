export interface Comment {
    id?: string,
    content: string,
    public: boolean,
    user_id ?: string,
    user_name? : string,
    parent_id? :string,
    post_id? : string,
    role? : string,
    created_at? : string
}
