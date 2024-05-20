import {Time} from "@angular/common";

export interface Group {
    id?: string,
    name?: string,
    banner?: string,
    level?: string,
    capacity?: number,
    lesson_time?: Date,
    lesson_days?: string
}
