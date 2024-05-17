import { FileR } from "./properties/file";
import { Link } from "./properties/link";

export interface Solution {
    id ?: string,
    files ?: File[],
    fileLinks ? : FileR[],
    links? : Link[],
    multimedia ?: FileR[],
    student_id ?: string,
    student_name ? : string,
    note ?: string,
    user_id?: string,
    updated_at : Date,
    videos? : Link[],
    description? : string
}
