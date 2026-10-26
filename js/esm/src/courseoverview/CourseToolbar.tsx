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
 * Card header of the course overview: title, search, filter menu and the block's course actions.
 *
 * @module     theme_retani_studio/courseoverview/CourseToolbar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import useDismiss from '../leftbar/useDismiss';
import {Caret, Grid, Icon, More, PATHS} from './icons';
import type {CourseAction, CourseFilter, CourseOverviewStrings, CourseView} from './types';

export interface CourseToolbarProps {
    filters: CourseFilter[];
    filter: CourseFilter;
    onFilter: (filter: CourseFilter) => void;
    search: string;
    onSearch: (value: string) => void;
    view: CourseView;
    views: CourseView[];
    onView: (view: CourseView) => void;
    actions: CourseAction[];
    strings: Pick<CourseOverviewStrings, 'title' | 'controls' | 'search' | 'filter' | 'cardview' | 'listview'>;
}

/**
 * Segmented Card / List switch, as in the mockup's Course overview card.
 *
 * @param props Component props.
 * @param props.view The current view.
 * @param props.onView Called with the chosen view.
 * @param props.strings Labels.
 * @returns The switch.
 */
function ViewSwitch({view, onView, strings}: {
    view: CourseView;
    onView: (view: CourseView) => void;
    strings: Pick<CourseOverviewStrings, 'cardview' | 'listview'>;
}) {
    const options: Array<{view: CourseView; label: string; glyph: ReactNode}> = [
        {view: 'card', label: strings.cardview, glyph: <Grid />},
        {view: 'list', label: strings.listview, glyph: <Icon path={PATHS.list} size={13} strokeWidth={2} />},
    ];
    return (
        <div className="retani-courseoverview-viewswitch">
            {options.map((option) => (
                <button key={option.view} type="button" title={option.label} aria-label={option.label}
                    aria-pressed={view === option.view} className={view === option.view ? 'is-active' : undefined}
                    onClick={() => onView(option.view)}>
                    {option.glyph}
                </button>
            ))}
        </div>
    );
}

/**
 * Search toggle: a square button that opens a text field beside it, as in the mockup's header search.
 *
 * @param props Component props.
 * @param props.value Current search text.
 * @param props.onChange Called with the new text.
 * @param props.label Field label.
 * @returns The search control.
 */
function SearchControl({value, onChange, label}: {value: string; onChange: (v: string) => void; label: string}) {
    const [open, setOpen] = useState<boolean>(value !== '');
    const input = useRef<HTMLInputElement>(null);
    const fieldid = useId();

    useEffect(() => {
        if (open) {
            input.current?.focus();
        }
    }, [open]);

    if (!open) {
        return (
            <button type="button" className="retani-courseoverview-iconbtn" title={label} aria-label={label}
                onClick={() => setOpen(true)}>
                <Icon path={PATHS.search} size={13} strokeWidth={2} />
            </button>
        );
    }

    const close = () => {
        onChange('');
        setOpen(false);
    };

    return (
        <div className="retani-courseoverview-search">
            <label htmlFor={fieldid} className="visually-hidden">{label}</label>
            <Icon path={PATHS.search} size={13} strokeWidth={2} />
            <input
                ref={input}
                id={fieldid}
                type="search"
                value={value}
                placeholder={label}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        close();
                    }
                }}
            />
            <button type="button" className="retani-courseoverview-searchclear" aria-label={label} onClick={close}>
                <Icon path={PATHS.close} size={10} strokeWidth={2.2} />
            </button>
        </div>
    );
}

/**
 * A menu button with a dropdown list beneath it.
 *
 * @param props Component props.
 * @param props.label Accessible name of the button.
 * @param props.button Button contents.
 * @param props.className Extra class for the button.
 * @param props.children Menu contents; receives a function that closes the menu.
 * @returns The menu.
 */
function Menu({label, button, className = '', children}: {
    label: string;
    button: ReactNode;
    className?: string;
    children: (close: () => void) => ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const wrapper = useRef<HTMLDivElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
    const menuid = useId();
    const close = () => setOpen(false);
    useDismiss(open, wrapper, close, toggle);

    return (
        <div className={`retani-courseoverview-menu${open ? ' is-open' : ''}`} ref={wrapper}>
            <button ref={toggle} type="button" className={className} aria-label={label} aria-expanded={open}
                aria-controls={menuid} onClick={() => setOpen(!open)}>
                {button}
            </button>
            {open && <div className="retani-courseoverview-dropdown" id={menuid}>{children(close)}</div>}
        </div>
    );
}

/**
 * Render the card header.
 *
 * @param props Component props.
 * @returns The header.
 */
export default function CourseToolbar({filters, filter, onFilter, search, onSearch, view, views, onView, actions,
    strings}: CourseToolbarProps) {
    const filtered = filters.length > 0 && filter.key !== filters[0].key;

    return (
        <div className="retani-courseoverview-header" role="search" aria-label={strings.controls}>
            <span className="retani-courseoverview-tile" aria-hidden="true">
                <Icon path={PATHS.courses} size={17} strokeWidth={2.1} />
            </span>
            <h2 className="retani-courseoverview-title">{strings.title}</h2>

            <SearchControl value={search} onChange={onSearch} label={strings.search} />

            {filters.length > 1 && (
                <Menu
                    label={`${strings.filter}: ${filter.label}`}
                    className="retani-courseoverview-pillbtn"
                    button={(
                        <>
                            <Icon path={PATHS.filter} size={13} strokeWidth={2} />
                            <span>{filtered ? filter.label : strings.filter}</span>
                            <Caret />
                        </>
                    )}
                >
                    {(close) => (
                        <ul className="retani-courseoverview-options">
                            {filters.map((option) => {
                                const selected = option.key === filter.key;
                                return (
                                    <li key={option.key}>
                                        <button
                                            type="button"
                                            className={`retani-courseoverview-option${selected ? ' is-selected' : ''}`}
                                            aria-pressed={selected}
                                            onClick={() => {
                                                onFilter(option);
                                                close();
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            <Icon path={PATHS.check} size={12} strokeWidth={2.6} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Menu>
            )}

            {views.length > 1 && <ViewSwitch view={view} onView={onView} strings={strings} />}

            {actions.length > 0 && (
                <Menu label={actions.map((a) => a.label).join(', ')} className="retani-courseoverview-morebtn"
                    button={<More />}>
                    {() => (
                        <ul className="retani-courseoverview-options">
                            {actions.map((action) => (
                                <li key={action.url}>
                                    <a className="retani-courseoverview-option" href={action.url}>{action.label}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </Menu>
            )}
        </div>
    );
}
