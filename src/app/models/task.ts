import { Link } from "./link";

export interface Task {
    title : string,
    description : string,
    links : Link[],
    videos : Link[],
    dueTo : Date
}
