import { Comment } from "./properties/comment";
import { FileR } from "./properties/file";
import { Link } from "./properties/link";
import { Solution } from "./solution";

export interface Assignment {
    id? : string,
    name : string,
    description? : string,
    dead_line ? : Date,
    show_dead_line ?: string,
    group_id : string | null,
    links? : Link[],
    videos? : Link[],
    files? : File[] ,
    fileLinks? : FileR[]
    multimedia? : FileR[],
    created_at? : string,
    updated_at ? : string,
    group_name? : string,
    groups? : any,
    comments? : Comment[],
    solutions ? : Solution[]
    solution ? : Solution
}
