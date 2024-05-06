import { FileR } from "./properties/file";
import { Link } from "./properties/link";

export interface Post {
    id? : number,
    name : string,
    subject : string,
    description : string,
    group_id : string,
    links : Link[],
    videos : Link[],
    files : FileR[]
    multimedia? : FileR[],
    created_at? : string,
    group_name? : string
}
