import { Link } from "./properties/link";

export interface Assignment {
    title : string,
    description : string,
    links : Link[],
    videos : Link[],
    dueTo : Date
}
