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
 * The right-hand block bar, from mockup/Moodle Dashboard Implementation /Retani Home.dc.html.
 *
 * A 300px bar docked on the right with a "Blocks" header and a collapse button. When collapsed, a vertical
 * "Blocks" tab on the right edge expands it again. In edit mode an "Add a block" card opens AddBlockDialog.
 * On wide screens the page makes room for the open bar (body class retani-blocksidebar-open); on narrow screens
 * the bar slides over the page with a backdrop.
 *
 * The blocks are Moodle's own (rendered in theme_retani_studio/retani/block_sidebar) and are moved into the
 * bar's body here, so every block keeps its markup and JavaScript.
 *
 * Mounted by core/react_autoinit from the {{#react}} helper in theme_retani_studio/retani/block_sidebar.
 *
 * @module     theme_retani_studio/blocksidebar/BlockSidebar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchOne} from '@moodle/lms/core/ajax';
import AddBlockDialog from './AddBlockDialog';
import {Icon} from './icons';
import type {BlockSidebarProps} from './types';

/** Body class the page layout uses to make room for the open bar. */
export const OPEN_CLASS = 'retani-blocksidebar-open';

/** The server-rendered blocks (theme_retani_studio/retani/block_sidebar). */
const BLOCKS_SELECTOR = '[data-region="retani-blocksidebar-blocks"]';

/** The bar is docked from the Bootstrap "xl" breakpoint up; below it, it slides over the page. */
const DOCKED_QUERY = '(min-width: 1200px)';

/**
 * Remember whether the bar is open, so the next page renders it the same way. Failures are ignored.
 *
 * @param preference The user preference name.
 * @param value Whether the bar is open.
 */
const savePreference = (preference: string, value: boolean): void => {
    fetchOne({
        methodname: 'core_user_update_user_preferences',
        args: {preferences: [{type: preference, value: value ? '1' : '0'}]},
    }).catch(() => undefined);
};

/**
 * Render the bar.
 *
 * @param props Component props, built by theme_retani_studio\output\block_sidebar.
 * @returns The bar.
 */
export default function BlockSidebar({open: initiallyopen, preference, editing, addblock, strings}: BlockSidebarProps) {
    const [docked, setDocked] = useState<boolean>(() => window.matchMedia(DOCKED_QUERY).matches);
    // On narrow screens the bar covers the page, so it always starts closed there.
    const [open, setOpen] = useState<boolean>(() => initiallyopen && window.matchMedia(DOCKED_QUERY).matches);
    const [adding, setAdding] = useState(false);
    const slot = useRef<HTMLDivElement>(null);
    const tab = useRef<HTMLButtonElement>(null);
    const closebutton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const media = window.matchMedia(DOCKED_QUERY);
        const update = () => {
            setDocked(media.matches);
            if (!media.matches) {
                setOpen(false);
            }
        };
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    // Keep the page layout in step with the bar.
    useEffect(() => {
        document.body.classList.toggle(OPEN_CLASS, open);
        document.getElementById('retani-blocksidebar')?.classList.toggle('is-open', open);
    }, [open]);

    // Move Moodle's blocks into the bar's body, and back out if the bar goes away.
    useEffect(() => {
        const target = slot.current;
        const blocks = document.querySelector<HTMLElement>(BLOCKS_SELECTOR);
        const home = blocks?.parentElement;
        if (!target || !blocks || !home) {
            return undefined;
        }
        const marker = document.createComment('retani-blocksidebar-blocks');
        home.insertBefore(marker, blocks);
        target.appendChild(blocks);
        return () => {
            marker.parentNode?.insertBefore(blocks, marker.nextSibling);
            marker.remove();
        };
    }, []);

    const toggle = useCallback((value: boolean) => {
        setOpen(value);
        // Only the docked bar is remembered: on narrow screens it is an overlay that always starts closed.
        if (docked) {
            savePreference(preference, value);
        }
        // Move focus with the bar, so keyboard users stay on a visible control.
        window.requestAnimationFrame(() => (value ? closebutton.current : tab.current)?.focus());
    }, [docked, preference]);

    // The overlay closes on Escape.
    useEffect(() => {
        if (!open || docked || adding) {
            return undefined;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                toggle(false);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, docked, adding, toggle]);

    const closeDialog = useCallback(() => setAdding(false), []);

    return (
        <>
            {open && !docked && (
                <div className="retani-blocksidebar-scrim" onClick={() => toggle(false)} aria-hidden="true" />
            )}
            <div className="retani-blocksidebar-panel" inert={!open || undefined}>
                <div className="retani-blocksidebar-header">
                    <h2 className="retani-blocksidebar-title">{strings.blocks}</h2>
                    <button
                        ref={closebutton}
                        type="button"
                        className="retani-blocksidebar-close"
                        title={strings.close}
                        aria-expanded={open}
                        aria-controls="retani-blocksidebar"
                        onClick={() => toggle(false)}
                    >
                        <Icon name="sidebar" size={16} strokeWidth={1.6} />
                        <span className="visually-hidden">{strings.close}</span>
                    </button>
                </div>
                <div className="retani-blocksidebar-body">
                    {editing && addblock && (
                        <button type="button" className="retani-blocksidebar-add" onClick={() => setAdding(true)}>
                            <span className="retani-blocksidebar-addicon" aria-hidden="true">
                                <Icon name="plus" size={14} strokeWidth={2.2} />
                            </span>
                            <span className="retani-blocksidebar-addtitle">{strings.addblock}</span>
                            <span className="retani-blocksidebar-addhint">{strings.addblockhint}</span>
                        </button>
                    )}
                    <div className="retani-blocksidebar-slot" ref={slot} />
                </div>
            </div>
            {!open && (
                <button
                    ref={tab}
                    type="button"
                    className="retani-blocksidebar-tab"
                    title={strings.open}
                    aria-expanded={false}
                    aria-controls="retani-blocksidebar"
                    onClick={() => toggle(true)}
                >
                    <Icon name="chevronleft" size={12} strokeWidth={2.4} />
                    <span className="retani-blocksidebar-tablabel">{strings.blocks}</span>
                    <span className="retani-blocksidebar-tabdot" aria-hidden="true" />
                    <span className="visually-hidden">{strings.open}</span>
                </button>
            )}
            {adding && addblock && <AddBlockDialog config={addblock} strings={strings} onClose={closeDialog} />}
        </>
    );
}
