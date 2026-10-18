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
 * Web service calls behind the course overview table.
 *
 * Components never call fetchOne directly: they go through these functions, so the request shapes live in
 * one place and can be mocked in tests.
 *
 * @module     theme_retani_studio/courseoverview/services/courses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {fetchOne} from '@moodle/lms/core/ajax';
import type {CourseDetails, CourseFilter, CourseView, EnrolledCourse} from '../types';

/**
 * Course record fields to load, as in block_myoverview/repository CARDLIST_REQUIRED_FIELDS. These name database
 * fields the exporter needs, not the exported ones: viewurl, progress and coursecategory are always returned.
 */
const REQUIRED_FIELDS = ['id', 'fullname', 'shortname', 'showcoursecategory', 'showshortname', 'visible', 'enddate'];

export interface CoursePageQuery {
    filter: CourseFilter;
    /** Search text; when set, the search covers all the user's courses, as in the stock block. */
    search: string;
    sort: string;
    limit: number;
    offset: number;
}

export interface CoursePage {
    courses: EnrolledCourse[];
    /** Offset to ask for the following page. */
    nextoffset: number;
}

/**
 * Fetch one page of the user's courses.
 *
 * @param query What to fetch.
 * @returns The page.
 */
export const getCoursePage = ({filter, search, sort, limit, offset}: CoursePageQuery): Promise<CoursePage> => {
    const searching = search.trim() !== '';
    return fetchOne<CoursePage>({
        methodname: 'core_course_get_enrolled_courses_by_timeline_classification',
        args: {
            classification: searching ? 'search' : filter.grouping,
            limit,
            offset,
            sort,
            customfieldname: filter.customfieldname ?? '',
            customfieldvalue: filter.customfieldvalue ?? '',
            searchvalue: search.trim(),
            requiredfields: REQUIRED_FIELDS,
        },
    });
};

/**
 * Fetch teachers, level, enrolments and completion rate for some courses.
 *
 * @param courseids The courses.
 * @returns Details for the courses the user can access.
 */
export const getCourseDetails = (courseids: number[]): Promise<CourseDetails[]> => {
    if (courseids.length === 0) {
        return Promise.resolve([]);
    }
    return fetchOne<CourseDetails[]>({
        methodname: 'theme_retani_studio_get_course_overview_details',
        args: {courseids},
    });
};

/**
 * Remember the chosen filter in the block's own preferences, so the stock block and the next visit agree.
 *
 * Failures are ignored: the table still works, it just will not remember the choice.
 *
 * @param filter The filter.
 */
export const saveFilterPreference = (filter: CourseFilter): void => {
    const preferences = [{type: 'block_myoverview_user_grouping_preference', value: filter.grouping}];
    if (filter.grouping === 'customfield') {
        preferences.push({
            type: 'block_myoverview_user_grouping_customfieldvalue_preference',
            value: filter.customfieldvalue ?? '',
        });
    }
    fetchOne({methodname: 'core_user_update_user_preferences', args: {preferences}}).catch(() => undefined);
};

/**
 * Remember the chosen view in the block's own view preference.
 *
 * Failures are ignored, as for the filter.
 *
 * @param view The view.
 */
export const saveViewPreference = (view: CourseView): void => {
    fetchOne({
        methodname: 'core_user_update_user_preferences',
        args: {preferences: [{type: 'block_myoverview_user_view_preference', value: view}]},
    }).catch(() => undefined);
};
