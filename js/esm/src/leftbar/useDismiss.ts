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
 * Close a dropdown on a click outside it or on Escape.
 *
 * @module     theme_retani_studio/leftbar/useDismiss
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, type RefObject} from 'react';

/**
 * While `open`, call `onDismiss` when the user presses outside `ref` or presses Escape.
 *
 * Escape also hands focus back to `returnFocus`, so keyboard users land on the control that opened the menu.
 *
 * @param open Whether the dropdown is open.
 * @param ref The element containing both the toggle and the dropdown.
 * @param onDismiss Called to close the dropdown.
 * @param returnFocus Element to focus after Escape.
 */
export default function useDismiss(
    open: boolean,
    ref: RefObject<HTMLElement | null>,
    onDismiss: () => void,
    returnFocus?: RefObject<HTMLElement | null>,
): void {
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const onPointer = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onDismiss();
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onDismiss();
                returnFocus?.current?.focus();
            }
        };
        document.addEventListener('mousedown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, ref, onDismiss, returnFocus]);
}
