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
 * One course in the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/CourseRow
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {isSet, type CourseRowData} from './types';
import type {Column} from './columns';

/** Placeholder for a value the user cannot see or the course does not have. */
const NONE = '–';

/**
 * Initials for a teacher's avatar: the first letter of the first and last words of their name.
 *
 * @param fullname The teacher's name.
 * @returns Up to two letters.
 */
export const initials = (fullname: string): string => {
    const words = fullname.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return '';
    }
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (first + last).toUpperCase();
};

/**
 * Format a percentage the way the mockup does: one decimal place at most.
 *
 * @param value The percentage.
 * @returns The text.
 */
const percent = (value: number): string => `${Math.round(value * 10) / 10}%`;

/**
 * The pill in the Level column. Beginner is drawn with the lime accent, as in the mockup.
 *
 * @param props Component props.
 * @param props.text The level or category.
 * @returns The pill.
 */
function LevelPill({text}: {text: string}) {
    const accent = text.trim().toLowerCase() === 'beginner';
    return (
        <span className={`retani-courseoverview-pill${accent ? ' is-accent' : ''}`}>
            <span className="retani-courseoverview-pilldot" aria-hidden="true" />
            {text}
        </span>
    );
}

/**
 * Render one cell.
 *
 * @param column The column.
 * @param row The course.
 * @param hiddenlabel Label for courses hidden from students.
 * @returns The cell contents.
 */
const cell = (column: Column, row: CourseRowData, hiddenlabel: string) => {
    const details = row.details;
    switch (column.key) {
        case 'code':
            return row.shortname;
        case 'name':
            return (
                <>
                    <a className="retani-courseoverview-name" href={row.viewurl} title={row.fullname}>{row.fullname}</a>
                    {!row.visible && <span className="retani-courseoverview-hidden">{hiddenlabel}</span>}
                </>
            );
        case 'level': {
            const text = column.source === 'level' ? details?.level : row.coursecategory;
            return text ? <LevelPill text={text} /> : NONE;
        }
        case 'teacher': {
            const teachers = details?.teachers ?? [];
            if (teachers.length === 0) {
                return NONE;
            }
            const [first] = teachers;
            const more = teachers.length - 1;
            return (
                <span className="retani-courseoverview-teacher" title={teachers.map((t) => t.fullname).join(', ')}>
                    <span className="retani-courseoverview-avatar" aria-hidden="true">{initials(first.fullname)}</span>
                    <span className="retani-courseoverview-teachername">{first.fullname}</span>
                    {more > 0 && <span className="retani-courseoverview-more">+{more}</span>}
                </span>
            );
        }
        case 'enrolled':
            return details?.enrolledcount ?? NONE;
        case 'rate': {
            if (column.source === 'completionrate') {
                const rate = details?.completionrate;
                return isSet(rate) ? percent(rate) : NONE;
            }
            return row.hasprogress && isSet(row.progress) ? percent(row.progress) : NONE;
        }
        default:
            return NONE;
    }
};

export interface CourseRowProps {
    row: CourseRowData;
    columns: Column[];
    template: string;
    hiddenlabel: string;
}

/**
 * Render a course row.
 *
 * @param props Component props.
 * @returns The row.
 */
export default function CourseRow({row, columns, template, hiddenlabel}: CourseRowProps) {
    return (
        <div className={`retani-courseoverview-row${row.visible ? '' : ' is-dimmed'}`} role="row"
            style={{gridTemplateColumns: template}}>
            {columns.map((column) => (
                <div key={column.key} role="cell" className={`retani-courseoverview-cell is-${column.key}${
                    column.numeric ? ' is-numeric' : ''}`}>
                    {cell(column, row, hiddenlabel)}
                </div>
            ))}
        </div>
    );
}
