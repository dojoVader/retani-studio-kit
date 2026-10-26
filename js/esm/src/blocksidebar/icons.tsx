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
 * Line icons for the block bar, from mockup/Moodle Dashboard Implementation /Retani Home.dc.html.
 *
 * @module     theme_retani_studio/blocksidebar/icons
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const PATHS = {
    plus: 'M12 5v14M5 12h14',
    close: 'M5 5l14 14M19 5L5 19',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    sidebar: 'M6 4h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM15 4v16',
    chevronleft: 'M15 5l-7 7 7 7',
    block: 'M4 4h16v16H4zM4 10h16',
} as const;

export type IconName = keyof typeof PATHS;

/** Icons for common blocks in the "Add a block" list, by block name; other blocks use the generic one. */
const BLOCK_PATHS: Record<string, string> = {
    activity_modules: 'M4 6h16M4 12h16M4 18h10',
    calendar_month: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
    calendar_upcoming: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
    comments: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
    completionstatus: 'M5 3h14v18H5zM9 11l2 2 4-4M9 17h6',
    news_items: 'M3 10v4l12 5V5zM15 9a3 3 0 0 1 0 6',
    badges: 'M12 2l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z',
    lp: 'M12 3a9 9 0 1 0 9 9h-9z',
    online_users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6',
    private_files: 'M4 4h10l6 6v10H4zM14 4v6h6',
    recentlyaccessedcourses: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
    html: 'M4 6h16M9 6v14M15 6v14',
    timeline: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
};

interface IconProps {
    name?: IconName;
    /** Raw path data, used instead of a named icon. */
    path?: string;
    size?: number;
    strokeWidth?: number;
}

/**
 * A line icon.
 *
 * @param props Component props.
 * @returns The svg.
 */
export function Icon({name, path, size = 14, strokeWidth = 2}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d={path ?? PATHS[name ?? 'block']} />
        </svg>
    );
}

/**
 * Icon path for a block in the "Add a block" list.
 *
 * @param name The block name (without "block_").
 * @returns Path data.
 */
export const blockIconPath = (name: string): string => BLOCK_PATHS[name] ?? PATHS.block;
