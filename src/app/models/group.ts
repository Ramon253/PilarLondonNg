import {Time} from "@angular/common";
import {Post} from "./post";
import {Assignment} from "./assignment";
import {Student} from "./student";

export interface Group {
    id?: string,
    name?: string,
    banner?: string,
    inputBanner? : File,
    level?: string,
    capacity?: number,
    lessons_time?: string,
    lesson_days?: string,
    studentNumber ? : number,
    posts ?: Post[],
    assignments ?: Assignment[],
    content ? : any [],
    students ?: Student[],
    created_at ?: Date,
    updated_at ?: Date,
}
