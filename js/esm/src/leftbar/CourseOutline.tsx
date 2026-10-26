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
 * "Current course" row and the course outline it toggles, under the category selector of the left bar.
 *
 * The outline is Moodle's own course index (a reactive core_courseformat component), rendered by the page in
 * the course index drawer inside theme_retani_studio/retani/course_outline. While the bar is on screen (wide
 * screens) that element is moved into the slot rendered here; when the screen gets too narrow for the bar it is
 * moved back into the drawer, so the course index stays reachable there.
 *
 * @module     theme_retani_studio/leftbar/CourseOutline
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useRef} from 'react';
import {Icon} from './icons';
import type {CurrentCourse, LeftBarStrings} from './types';

/** The server-rendered outline (theme_retani_studio/retani/course_outline). */
const OUTLINE_SELECTOR = '[data-region="retani-courseoutline"]';

/** The bar is shown from the Bootstrap "lg" breakpoint up (see scss/retani_leftbar.scss). */
const WIDE_QUERY = '(min-width: 992px)';

export interface CourseRowProps {
    course: CurrentCourse;
    collapsed: boolean;
    /** Whether the outline is shown. */
    open: boolean;
    onToggle: () => void;
    strings: Pick<LeftBarStrings, 'currentcourse' | 'courseoutline'>;
    /** Id of the outline panel, for aria-controls. */
    panelid: string;
}

/**
 * The "Current course" row: the course name and a tile which shows whether the outline is open.
 *
 * @param props Component props.
 * @returns The row.
 */
export function CourseRow({course, collapsed, open, onToggle, strings, panelid}: CourseRowProps) {
    const label = `${strings.courseoutline}: ${course.name}`;
    return (
        <div className="retani-leftbar-course">
            <button
                type="button"
                className={`retani-leftbar-coursetoggle${open ? ' is-open' : ''}`}
                aria-expanded={open}
                aria-controls={panelid}
                title={collapsed ? label : strings.courseoutline}
                onClick={onToggle}
            >
                {collapsed ? (
                    <span className="visually-hidden">{label}</span>
                ) : (
                    <span className="retani-leftbar-coursetext">
                        <span className="retani-leftbar-coursecaption">{strings.currentcourse}</span>
                        <span className="retani-leftbar-coursename">{course.name}</span>
                    </span>
                )}
                <span className="retani-leftbar-coursetile" aria-hidden="true">
                    <Icon name="outline" size={14} />
                </span>
            </button>
        </div>
    );
}

export interface CourseOutlineProps {
    /** Whether the panel is visible. It stays mounted when hidden, so the moved course index keeps its state. */
    visible: boolean;
    id: string;
    label: string;
}

/**
 * The slot the course index is moved into.
 *
 * @param props Component props.
 * @returns The outline panel.
 */
export function CourseOutline({visible, id, label}: CourseOutlineProps) {
    const slot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = slot.current;
        const outline = document.querySelector<HTMLElement>(OUTLINE_SELECTOR);
        const home = outline?.parentElement;
        if (!target || !outline || !home) {
            return undefined;
        }

        // Keep the place in the drawer, so the outline can go back exactly where it came from.
        const marker = document.createComment('retani-courseoutline');
        home.insertBefore(marker, outline);

        const media = window.matchMedia(WIDE_QUERY);
        const place = () => {
            if (media.matches) {
                target.appendChild(outline);
            } else {
                marker.parentNode?.insertBefore(outline, marker.nextSibling);
            }
        };
        place();
        media.addEventListener('change', place);

        return () => {
            media.removeEventListener('change', place);
            marker.parentNode?.insertBefore(outline, marker.nextSibling);
            marker.remove();
        };
    }, []);

    // React renders no children here: the course index is placed in the slot by the effect above.
    return (
        <div className="retani-leftbar-outline" id={id} role="region" aria-label={label} hidden={!visible}>
            <div className="retani-leftbar-outline-slot" ref={slot} />
        </div>
    );
}
