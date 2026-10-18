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
 * Load a page of courses, then their extra details, for the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/useCourses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useRef, useState} from 'react';
import {getCourseDetails, getCoursePage} from './services/courses';
import type {CourseDetails, CourseFilter, CourseRowData} from './types';

export interface CoursesState {
    rows: CourseRowData[];
    loading: boolean;
    failed: boolean;
    /** Whether another page follows this one. */
    hasnext: boolean;
    /** Offset of the following page. */
    nextoffset: number;
}

export interface CoursesQuery {
    filter: CourseFilter;
    search: string;
    sort: string;
    limit: number;
    offset: number;
}

const INITIAL: CoursesState = {rows: [], loading: true, failed: false, hasnext: false, nextoffset: 0};

/**
 * Fetch the courses for a query, refetching whenever it changes.
 *
 * The rows appear as soon as the course list arrives; teachers, level, enrolments and completion rate fill in
 * when the second call returns. Responses for an older query are dropped, so fast typing in the search box
 * cannot leave stale rows on screen.
 *
 * @param query What to load.
 * @returns The loading state and rows.
 */
export default function useCourses({filter, search, sort, limit, offset}: CoursesQuery): CoursesState {
    const [state, setState] = useState<CoursesState>(INITIAL);
    const latest = useRef(0);

    useEffect(() => {
        const request = ++latest.current;
        const current = () => request === latest.current;
        setState((previous) => ({...previous, loading: true, failed: false}));

        const load = async(): Promise<void> => {
            let page;
            try {
                page = await getCoursePage({filter, search, sort, limit, offset});
            } catch {
                if (current()) {
                    setState({...INITIAL, loading: false, failed: true});
                }
                return;
            }
            if (!current()) {
                return;
            }
            const {courses, nextoffset} = page;
            setState({
                rows: courses.map((course) => ({...course, details: null})),
                loading: false,
                failed: false,
                // A full page means there may be more; the service skips hidden courses, so check nextoffset too.
                hasnext: limit > 0 && courses.length >= limit && nextoffset > offset,
                nextoffset,
            });

            let details: CourseDetails[];
            try {
                details = await getCourseDetails(courses.map((course) => course.id));
            } catch {
                return; // The table is still useful without the extra columns.
            }
            if (!current()) {
                return;
            }
            const byid = new Map<number, CourseDetails>(details.map((d) => [d.id, d]));
            setState((previous) => ({
                ...previous,
                rows: previous.rows.map((row) => ({...row, details: byid.get(row.id) ?? null})),
            }));
        };
        load();
    }, [filter, search, sort, limit, offset]);

    return state;
}
