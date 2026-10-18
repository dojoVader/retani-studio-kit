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
 * The course table: sortable header, course rows, and the loading, empty and error states.
 *
 * @module     theme_retani_studio/courseoverview/CourseTable
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import CourseRow from './CourseRow';
import {gridTemplate, type Column} from './columns';
import {SortArrows} from './icons';
import type {CourseOverviewStrings, CourseRowData, SortKey, SortState} from './types';

/** Skeleton rows shown while a page loads, matching the block_myoverview/placeholders override. */
const SKELETON_ROWS = 4;

export interface CourseTableProps {
    rows: CourseRowData[];
    columns: Column[];
    loading: boolean;
    failed: boolean;
    search: string;
    sort: SortState | null;
    onSort: (key: SortKey) => void;
    strings: Pick<CourseOverviewStrings, 'sortby' | 'nocourses' | 'nomatch' | 'loadfailed' | 'hidden'>;
}

/**
 * Render the table.
 *
 * @param props Component props.
 * @returns The table.
 */
export default function CourseTable({rows, columns, loading, failed, search, sort, onSort, strings}: CourseTableProps) {
    const template = gridTemplate(columns);

    let body;
    if (loading && rows.length === 0) {
        body = Array.from({length: SKELETON_ROWS}, (_, i) => (
            <div key={i} className="retani-courseoverview-row is-skeleton" aria-hidden="true"
                style={{gridTemplateColumns: template}}>
                {columns.map((c) => <span key={c.key} />)}
            </div>
        ));
    } else if (failed) {
        body = <div className="retani-courseoverview-empty" role="alert">{strings.loadfailed}</div>;
    } else if (rows.length === 0) {
        body = (
            <div className="retani-courseoverview-empty">
                {search.trim() ? strings.nomatch.replace('{$a}', search.trim()) : strings.nocourses}
            </div>
        );
    } else {
        body = rows.map((row) => (
            <CourseRow key={row.id} row={row} columns={columns} template={template} hiddenlabel={strings.hidden} />
        ));
    }

    return (
        <div className={`retani-courseoverview-table${loading ? ' is-loading' : ''}`} role="table"
            aria-busy={loading}>
            <div className="retani-courseoverview-row is-head" role="row" style={{gridTemplateColumns: template}}>
                {columns.map((column) => {
                    const direction = sort?.dir === 1 ? 'asc' : 'desc';
                    const active = sort?.key === column.sort;
                    const ariasort = direction === 'asc' ? 'ascending' : 'descending';
                    return (
                        <div key={column.key} role="columnheader" aria-sort={active ? ariasort : undefined}
                            className={`retani-courseoverview-cell is-${column.key}${column.numeric ? ' is-numeric' : ''}`}>
                            {column.sort ? (
                                <button
                                    type="button"
                                    className={`retani-courseoverview-sort${active ? ` is-${direction}` : ''}`}
                                    title={strings.sortby.replace('{$a}', column.label)}
                                    onClick={() => onSort(column.sort as SortKey)}
                                >
                                    {column.label}
                                    <SortArrows />
                                </button>
                            ) : column.label}
                        </div>
                    );
                })}
            </div>
            {body}
        </div>
    );
}
