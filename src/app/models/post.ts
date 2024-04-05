import { Link } from "./link";

export interface Post {
    title : string,
    description : string,
    links : Link[],
    videos : Link[  ]
}
