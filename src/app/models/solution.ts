import { FileR } from "./properties/file";
import { Link } from "./properties/link";

export interface Solution {
    id ?: string,
    files ?: File[],
    fileLinks ? : FileR[],
    links? : Link[],
    multimedia ?: FileR[],
    user_id ?: string,
    user_name ? : string,
    note ?: string,
    updated_at? : Date
}
