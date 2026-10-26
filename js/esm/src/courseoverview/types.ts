// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Types for the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/types
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** A course grouping the block offers, as built by theme_retani_studio\output\block_myoverview_renderer. */
export interface CourseFilter {
    /** Unique key: the grouping, or `customfield:<value>` for custom field values. */
    key: string;
    /** Classification passed to core_course_get_enrolled_courses_by_timeline_classification. */
    grouping: string;
    label: string;
    customfieldname?: string;
    customfieldvalue?: string;
}

/** A link from the block's course actions (Manage courses, Create course, Request a course). */
export interface CourseAction {
    url: string;
    label: string;
    primary: boolean;
}

export interface CourseOverviewStrings {
    title: string;
    controls: string;
    search: string;
    filter: string;
    code: string;
    coursename: string;
    level: string;
    category: string;
    teacher: string;
    enrolled: string;
    completionrate: string;
    progress: string;
    /** "Sort by {$a}". */
    sortby: string;
    nocourses: string;
    /** "No courses match {$a}". */
    nomatch: string;
    loadfailed: string;
    previous: string;
    next: string;
    /** "Page {$a}". */
    page: string;
    hidden: string;
    cardview: string;
    listview: string;
    /** "{$a}% complete". */
    completepercent: string;
    noprogress: string;
    entercourse: string;
}

/** How the courses are shown: the card grid, or the table. */
export type CourseView = 'card' | 'list';

/** Props from theme_retani_studio\output\block_myoverview_renderer::get_react_props(). */
export interface CourseOverviewProps {
    filters: CourseFilter[];
    /** Key of the selected filter, from the user's grouping preference. */
    filter: string;
    /** View from the user's view preference. */
    view: CourseView;
    /** Views the block's settings allow; the switch only shows when there is more than one. */
    views: CourseView[];
    /** Server-side sort, from the user's sort preference, e.g. "fullname" or "ul.timeaccess desc". */
    sort: string;
    /** Courses per page; 0 shows them all. */
    paging: number;
    showcategory: boolean;
    actions: CourseAction[];
    strings: CourseOverviewStrings;
}

/** A course as returned by core_course_get_enrolled_courses_by_timeline_classification. */
export interface EnrolledCourse {
    id: number;
    fullname: string;
    shortname: string;
    viewurl: string;
    /** Course image, or a generated pattern when the course has none. */
    courseimage: string;
    coursecategory?: string;
    visible: boolean;
    hasprogress: boolean;
    progress: number | null;
}

export interface Teacher {
    id: number;
    fullname: string;
    rolename: string;
}

/** Extra details from theme_retani_studio_get_course_overview_details. */
export interface CourseDetails {
    id: number;
    level?: string | null;
    teachers: Teacher[];
    /** Only present where the user may view the participants. */
    enrolledcount?: number | null;
    /** Only present where the user may view the participants and completion tracking is on. */
    completionrate?: number | null;
}

/** One table row: the course with whatever details have arrived for it. */
export interface CourseRowData extends EnrolledCourse {
    details: CourseDetails | null;
}

/**
 * Whether a value from a web service is present (neither null nor missing).
 *
 * @param value The value.
 * @returns True when there is a value.
 */
export const isSet = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

/** Columns the table can sort on, client side, within the loaded page. */
export type SortKey = 'level' | 'enrolled' | 'rate';

export interface SortState {
    key: SortKey;
    /** 1 ascending, -1 descending. */
    dir: 1 | -1;
}
