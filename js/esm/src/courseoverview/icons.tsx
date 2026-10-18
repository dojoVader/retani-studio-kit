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
 * Glyphs used by the course overview table, taken from mockup/Retani Dashboard.dc.html.
 *
 * @module     theme_retani_studio/courseoverview/icons
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export {Icon} from '../leftbar/icons';

export const PATHS = {
    courses: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    filter: 'M4 7h16M7 12h10M10 17h4',
    close: 'M5 5l14 14M19 5L5 19',
    check: 'M5 12l5 5 9-10',
    previous: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6',
    folder: 'M3 6h6l2 2h10v11H3z',
    list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
} as const;

/**
 * The small triangle on menu buttons; rotated by CSS while the menu is open.
 *
 * @returns The caret.
 */
export function Caret() {
    return (
        <svg className="retani-courseoverview-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
            focusable="false">
            <path d="M2 3.5h6L5 7z" fill="currentColor" />
        </svg>
    );
}

/**
 * Up/down arrows on sortable column headers. The arrow for the active direction is drawn darker by CSS.
 *
 * @returns The arrows.
 */
export function SortArrows() {
    return (
        <svg className="retani-courseoverview-sortarrows" width="6" height="9" viewBox="0 0 6 9" aria-hidden="true"
            focusable="false">
            <path className="is-up" d="M3 0l3 3.5H0z" fill="currentColor" />
            <path className="is-down" d="M3 9L0 5.5h6z" fill="currentColor" />
        </svg>
    );
}

/**
 * The three-dot "more" glyph from the mockup's card headers.
 *
 * @returns The glyph.
 */
export function More() {
    return (
        <svg width="16" height="4" viewBox="0 0 16 4" aria-hidden="true" focusable="false">
            <circle cx="2" cy="2" r="1.3" fill="currentColor" />
            <circle cx="8" cy="2" r="1.3" fill="currentColor" />
            <circle cx="14" cy="2" r="1.3" fill="currentColor" />
        </svg>
    );
}

/**
 * The four-square glyph for the card view switch.
 *
 * @returns The glyph.
 */
export function Grid() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
        </svg>
    );
}
