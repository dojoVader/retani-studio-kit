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
 * Course overview block content, drawn as the "Top Performance Courses" table from mockup/Retani Dashboard.dc.html.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/courseoverview/CourseOverview"
 * by core/react_autoinit, from the {{#react}} helper in the theme's block_myoverview/main override.
 *
 * @module     theme_retani_studio/courseoverview/CourseOverview
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useEffect, useMemo, useState} from 'react';
import CourseCards from './CourseCards';
import CoursePager from './CoursePager';
import CourseTable from './CourseTable';
import CourseToolbar from './CourseToolbar';
import {getColumns, sortRows} from './columns';
import {saveFilterPreference, saveViewPreference} from './services/courses';
import useCourses from './useCourses';
import type {CourseFilter, CourseOverviewProps, CourseView, SortKey, SortState} from './types';

/** Wait this long after the last keystroke before searching. */
const SEARCH_DELAY = 300;

/** Used when the block offers no filters at all, which its settings allow. */
const FALLBACK_FILTER: CourseFilter = {key: 'all', grouping: 'all', label: ''};

/**
 * Render the course overview.
 *
 * @param props Component props, built by theme_retani_studio\output\block_myoverview_renderer.
 * @returns The block content.
 */
export default function CourseOverview({filters, filter: initialfilter, view: initialview, views, sort: serversort, paging,
    showcategory, actions, strings}: CourseOverviewProps) {
    const [filter, setFilter] = useState<CourseFilter>(
        () => filters.find((f) => f.key === initialfilter) ?? filters[0] ?? FALLBACK_FILTER,
    );
    const [view, setView] = useState<CourseView>(initialview);
    const [searchtext, setSearchtext] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortState | null>(null);
    // Offsets of the pages visited so far; the last one is on screen.
    const [offsets, setOffsets] = useState<number[]>([0]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSearch(searchtext);
            setOffsets([0]);
        }, SEARCH_DELAY);
        return () => window.clearTimeout(timer);
    }, [searchtext]);

    const offset = offsets[offsets.length - 1];
    const {rows, loading, failed, hasnext, nextoffset} = useCourses({filter, search, sort: serversort, limit: paging,
        offset});

    const columns = useMemo(() => getColumns(rows, showcategory, strings), [rows, showcategory, strings]);
    const sorted = useMemo(() => sortRows(rows, columns, sort), [rows, columns, sort]);

    const onFilter = useCallback((option: CourseFilter) => {
        setFilter(option);
        setOffsets([0]);
        saveFilterPreference(option);
    }, []);

    const onView = useCallback((option: CourseView) => {
        setView(option);
        saveViewPreference(option);
    }, []);

    // First click sorts descending (highest enrolment or completion first), as in the mockup; the next flips it.
    const onSort = useCallback((key: SortKey) => {
        setSort((current) => {
            if (current?.key !== key) {
                return {key, dir: -1};
            }
            return {key, dir: current.dir === 1 ? -1 : 1};
        });
    }, []);

    return (
        <div className="retani-courseoverview">
            <CourseToolbar
                filters={filters}
                filter={filter}
                onFilter={onFilter}
                search={searchtext}
                onSearch={setSearchtext}
                view={view}
                views={views}
                onView={onView}
                actions={actions}
                strings={strings}
            />
            {view === 'card' ? (
                <CourseCards courses={rows} loading={loading} failed={failed} search={search} strings={strings} />
            ) : (
                <CourseTable
                    rows={sorted}
                    columns={columns}
                    loading={loading}
                    failed={failed}
                    search={search}
                    sort={sort}
                    onSort={onSort}
                    strings={strings}
                />
            )}
            <CoursePager
                page={offsets.length - 1}
                hasprevious={offsets.length > 1}
                hasnext={hasnext}
                disabled={loading}
                onPrevious={() => setOffsets((o) => o.slice(0, -1))}
                onNext={() => setOffsets((o) => [...o, nextoffset])}
                strings={strings}
            />
        </div>
    );
}
