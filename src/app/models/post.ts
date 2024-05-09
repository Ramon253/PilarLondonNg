import { FileR } from "./properties/file";
import { Link } from "./properties/link";
import {Comment} from "./properties/comment";
import { FormsModule } from "@angular/forms";

export interface Post {
    id? : number,
    name : string,
    subject? : string,
    description? : string,
    group_id : string | null,
    links? : Link[],
    videos? : Link[],
    files? : File[] ,
    fileLinks? : FileR[]
    multimedia? : FileR[],
    created_at? : string,
    group_name? : string,
    comments? : Comment[]
}
