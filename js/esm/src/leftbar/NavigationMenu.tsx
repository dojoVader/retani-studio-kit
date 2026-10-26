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
 * Navigation menu of the left bar: top-level links and expandable groups of child links.
 *
 * @module     theme_retani_studio/leftbar/NavigationMenu
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useId, useState} from 'react';
import {Caret, Icon} from './icons';
import type {NavItem} from './types';

export interface NavigationMenuProps {
    items: NavItem[];
    collapsed: boolean;
    /** Expand the whole bar; used when a group is opened while the bar is collapsed. */
    onExpand: () => void;
    /** Extra class for the list, e.g. to style the footer section differently. */
    className?: string;
}

interface NavGroupProps {
    item: NavItem;
    collapsed: boolean;
    open: boolean;
    onToggle: (key: string) => void;
}

/**
 * The icon tile in front of every top-level item.
 *
 * @param props Component props.
 * @param props.item The navigation item.
 * @returns The tile.
 */
function ItemTile({item}: {item: NavItem}) {
    return (
        <span className="retani-leftbar-tile" aria-hidden="true">
            <Icon name={item.icon} />
        </span>
    );
}

/**
 * A top-level item without children: a plain link.
 *
 * @param props Component props.
 * @param props.item The navigation item.
 * @param props.collapsed Whether the bar is collapsed (icon only).
 * @returns The link.
 */
function NavLink({item, collapsed}: {item: NavItem; collapsed: boolean}) {
    return (
        <a
            className={`retani-leftbar-item${item.active ? ' is-active' : ''}`}
            href={item.url}
            title={collapsed ? item.label : undefined}
            aria-current={item.active ? 'page' : undefined}
            {...(item.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
            <ItemTile item={item} />
            <span className={collapsed ? 'visually-hidden' : 'retani-leftbar-label'}>{item.label}</span>
        </a>
    );
}

/**
 * A top-level item with children: a disclosure button and the list it reveals.
 *
 * @param props Component props.
 * @returns The group.
 */
function NavGroup({item, collapsed, open, onToggle}: NavGroupProps) {
    const listid = useId();
    const expanded = open && !collapsed;
    return (
        <>
            <button
                type="button"
                className={`retani-leftbar-item${item.active ? ' is-active' : ''}${expanded ? ' is-open' : ''}`}
                title={collapsed ? item.label : undefined}
                aria-expanded={expanded}
                aria-controls={listid}
                onClick={() => onToggle(item.key)}
            >
                <ItemTile item={item} />
                <span className={collapsed ? 'visually-hidden' : 'retani-leftbar-label'}>{item.label}</span>
                {!collapsed && <Caret />}
            </button>
            <ul className="retani-leftbar-children" id={listid} hidden={!expanded}>
                {item.children.map((child) => (
                    <li key={child.url}>
                        <a
                            className={`retani-leftbar-child${child.active ? ' is-active' : ''}`}
                            href={child.url}
                            aria-current={child.active ? 'page' : undefined}
                        >
                            <span className="retani-leftbar-dot" aria-hidden="true" />
                            <span className="retani-leftbar-label">{child.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
}

/**
 * Render a list of navigation items.
 *
 * Groups that contain the current page start open. Opening a group while the bar is collapsed expands the bar
 * first, since the children cannot be shown in icon-only mode.
 *
 * @param props Component props.
 * @returns The menu.
 */
export default function NavigationMenu({items, collapsed, onExpand, className = ''}: NavigationMenuProps) {
    const [openkeys, setOpenkeys] = useState<Set<string>>(
        () => new Set(items.filter((item) => item.active && item.children.length > 0).map((item) => item.key)),
    );

    const onToggle = useCallback((key: string) => {
        if (collapsed) {
            onExpand();
            setOpenkeys((current) => new Set(current).add(key));
            return;
        }
        setOpenkeys((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, [collapsed, onExpand]);

    return (
        <ul className={`retani-leftbar-menu ${className}`.trim()}>
            {items.map((item) => (
                <li key={item.key} className="retani-leftbar-menuitem">
                    {item.children.length > 0 ? (
                        <NavGroup item={item} collapsed={collapsed} open={openkeys.has(item.key)} onToggle={onToggle} />
                    ) : (
                        <NavLink item={item} collapsed={collapsed} />
                    )}
                </li>
            ))}
        </ul>
    );
}
