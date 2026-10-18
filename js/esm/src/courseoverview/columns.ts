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
 * Which columns the course overview table shows, and how it sorts them.
 *
 * The mockup's columns are Code, Course name, Level, Teacher, Enrolled and Completion rate. Some of these depend
 * on what the site has and what the user may see, so they adapt:
 * - Level shows the "level" course custom field, or the course category when no course has a level.
 * - Enrolled is left out when the user cannot see participant counts for any course on the page.
 * - Completion rate shows the class completion rate where the user may see it, otherwise their own progress.
 *
 * @module     theme_retani_studio/courseoverview/columns
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {isSet, type CourseOverviewStrings, type CourseRowData, type SortKey, type SortState} from './types';

export type ColumnKey = 'code' | 'name' | 'level' | 'teacher' | 'enrolled' | 'rate';

export interface Column {
    key: ColumnKey;
    label: string;
    /** Width weight, from the mockup's grid (72 216 118 144 80 122). */
    weight: number;
    numeric?: boolean;
    sort?: SortKey;
    /** Where the value comes from, for columns that adapt. */
    source?: 'level' | 'category' | 'completionrate' | 'progress';
}

/** Order for the usual level names; anything else sorts alphabetically after them. */
const LEVEL_ORDER: Record<string, number> = {beginner: 0, intermediate: 1, advanced: 2};

/**
 * Work out the columns for the rows on screen.
 *
 * @param rows The rows.
 * @param showcategory Whether the block is set to show course categories.
 * @param strings Column labels.
 * @returns The columns.
 */
export const getColumns = (
    rows: CourseRowData[],
    showcategory: boolean,
    strings: CourseOverviewStrings,
): Column[] => {
    const haslevel = rows.some((r) => r.details?.level);
    const hasenrolled = rows.some((r) => isSet(r.details?.enrolledcount));
    const hasrate = rows.some((r) => isSet(r.details?.completionrate));

    const columns: Column[] = [
        {key: 'code', label: strings.code, weight: 72},
        {key: 'name', label: strings.coursename, weight: 216},
    ];
    if (haslevel || showcategory) {
        columns.push({
            key: 'level',
            label: haslevel ? strings.level : strings.category,
            weight: 118,
            sort: 'level',
            source: haslevel ? 'level' : 'category',
        });
    }
    columns.push({key: 'teacher', label: strings.teacher, weight: 144});
    if (hasenrolled) {
        columns.push({key: 'enrolled', label: strings.enrolled, weight: 80, numeric: true, sort: 'enrolled'});
    }
    columns.push({
        key: 'rate',
        label: hasrate ? strings.completionrate : strings.progress,
        weight: 122,
        numeric: true,
        sort: 'rate',
        source: hasrate ? 'completionrate' : 'progress',
    });
    return columns;
};

/**
 * CSS grid template for the columns.
 *
 * @param columns The columns.
 * @returns The template.
 */
export const gridTemplate = (columns: Column[]): string =>
    columns.map((c) => `minmax(0, ${c.weight}fr)`).join(' ');

/**
 * The value a row sorts by for a column.
 *
 * @param row The row.
 * @param column The column being sorted.
 * @returns A number, a string, or null for rows without a value (which always sort last).
 */
const sortValue = (row: CourseRowData, column: Column): number | string | null => {
    switch (column.sort) {
        case 'level': {
            const text = (column.source === 'level' ? row.details?.level : row.coursecategory) ?? '';
            if (!text) {
                return null;
            }
            const rank = LEVEL_ORDER[text.trim().toLowerCase()];
            return rank === undefined ? `~${text.toLowerCase()}` : `${rank}`;
        }
        case 'enrolled':
            return row.details?.enrolledcount ?? null;
        case 'rate':
            if (column.source === 'completionrate') {
                return row.details?.completionrate ?? null;
            }
            return row.hasprogress ? row.progress : null;
        default:
            return null;
    }
};

/**
 * Sort the loaded rows by a column. Without a sort, the server order (the user's sort preference) is kept.
 *
 * @param rows The rows.
 * @param columns The columns on screen.
 * @param sort The sort, or null.
 * @returns The sorted rows.
 */
export const sortRows = (rows: CourseRowData[], columns: Column[], sort: SortState | null): CourseRowData[] => {
    const column = sort && columns.find((c) => c.sort === sort.key);
    if (!sort || !column) {
        return rows;
    }
    return [...rows].sort((a, b) => {
        const va = sortValue(a, column);
        const vb = sortValue(b, column);
        // Rows without a value go last whichever way the column is sorted.
        if (va === null) {
            return vb === null ? 0 : 1;
        }
        if (vb === null) {
            return -1;
        }
        const order = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
        return order * sort.dir;
    });
};
