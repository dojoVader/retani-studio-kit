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
 * Previous / next paging under the course table.
 *
 * @module     theme_retani_studio/courseoverview/CoursePager
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Icon, PATHS} from './icons';
import type {CourseOverviewStrings} from './types';

export interface CoursePagerProps {
    /** Zero-based page number. */
    page: number;
    hasprevious: boolean;
    hasnext: boolean;
    disabled: boolean;
    onPrevious: () => void;
    onNext: () => void;
    strings: Pick<CourseOverviewStrings, 'previous' | 'next' | 'page'>;
}

/**
 * Render the pager, or nothing when everything fits on one page.
 *
 * @param props Component props.
 * @returns The pager.
 */
export default function CoursePager({page, hasprevious, hasnext, disabled, onPrevious, onNext, strings}: CoursePagerProps) {
    if (!hasprevious && !hasnext) {
        return null;
    }
    return (
        <nav className="retani-courseoverview-pager" aria-label={strings.page.replace('{$a}', String(page + 1))}>
            <span className="retani-courseoverview-pagestatus" aria-live="polite">
                {strings.page.replace('{$a}', String(page + 1))}
            </span>
            <button type="button" className="retani-courseoverview-iconbtn" aria-label={strings.previous}
                title={strings.previous} disabled={disabled || !hasprevious} onClick={onPrevious}>
                <Icon path={PATHS.previous} size={13} strokeWidth={2.2} />
            </button>
            <button type="button" className="retani-courseoverview-iconbtn" aria-label={strings.next}
                title={strings.next} disabled={disabled || !hasnext} onClick={onNext}>
                <Icon path={PATHS.next} size={13} strokeWidth={2.2} />
            </button>
        </nav>
    );
}
