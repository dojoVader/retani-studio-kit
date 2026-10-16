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
 * Line icons used by the left bar, taken from the EduCore dashboard mockup.
 *
 * @module     theme_retani_studio/leftbar/icons
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {IconName} from './types';

const PATHS: Record<IconName, string> = {
    dashboard: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
    courses: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
    management: 'M4 5h16v11H4zM8 20h8M12 16v4',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M16 3a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5',
    grades: 'M5 3h14v18H5zM9 11l2 2 4-4M9 17h6',
    reports: 'M5 20v-8M10 20V6M15 20v-9M20 20V9',
    badges: 'M12 2l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z',
    competencies: 'M12 3a9 9 0 1 0 9 9h-9zM15 3.5A9 9 0 0 1 20.5 9H15z',
    admin: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1'
        + 'M4.9 19.1L7 17M17 7l2.1-2.1',
    help: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
    sidebar: 'M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM9 4v16',
};

/**
 * Decorative glyphs for course categories, cycled by position so each category gets a stable look.
 * Flat Retani ink tiles, with the lime accent on every third one, as in mockup/Retani Dashboard.dc.html.
 */
export const CATEGORY_STYLES: ReadonlyArray<{gradient: string; path: string}> = [
    {gradient: '#111111', path: 'M12 3L2.5 20h19zM7 20l7.5-9'},
    {gradient: '#111111', path: 'M8 7l-5 5 5 5M16 7l5 5-5 5'},
    {gradient: '#95bf47', path: 'M3 10v4l12 5V5zM15 9a3 3 0 0 1 0 6'},
    {gradient: '#111111', path: 'M4 8h16v11H4zM9 8V5h6v3'},
];

interface IconProps {
    name?: IconName;
    /** Raw path data, used instead of a named icon. */
    path?: string;
    size?: number;
    strokeWidth?: number;
}

/**
 * Render a stroked line icon. Always decorative: the surrounding control carries the label.
 *
 * @param props Component props.
 * @returns The icon.
 */
export function Icon({name, path, size = 13, strokeWidth = 2.2}: IconProps) {
    const d = path ?? (name ? PATHS[name] : '');
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d={d} />
        </svg>
    );
}

/**
 * The small triangle used to show a menu can open; rotated by CSS when open.
 *
 * @param props Component props.
 * @param props.up Point upwards when closed (for menus that open above).
 * @returns The caret.
 */
export function Caret({up = false}: {up?: boolean}) {
    return (
        <svg className="retani-leftbar-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
            focusable="false">
            <path d={up ? 'M2 6.5h6L5 3z' : 'M2 3.5h6L5 7z'} fill="currentColor" />
        </svg>
    );
}

/**
 * Check mark shown against the selected category.
 *
 * @returns The check icon.
 */
export function Check() {
    return <Icon path="M5 12l5 5 9-10" size={13} strokeWidth={2.4} />;
}
