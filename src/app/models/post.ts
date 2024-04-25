import { Link } from "./properties/link";

export interface Post {
    name : string,
    subject : string,
    description : string,
    group_id : string,
    links : Link[],
    videos : Link[],
    files : File[]
}
