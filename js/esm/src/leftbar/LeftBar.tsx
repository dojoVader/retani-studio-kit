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
 * Retractable left bar: brand, course category selector, navigation menu and user menu.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/leftbar/LeftBar"
 * by core/react_autoinit, from the {{#react}} helper in theme_retani_studio/retani/left_bar.
 *
 * @module     theme_retani_studio/leftbar/LeftBar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useEffect, useState} from 'react';
import {fetchOne} from '@moodle/lms/core/ajax';
import CategorySelector from './CategorySelector';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';
import {Icon} from './icons';
import type {LeftBarProps, OpenMenu} from './types';

/** Body class the page layout uses to narrow the space reserved for the bar. */
export const COLLAPSED_CLASS = 'retani-leftbar-collapsed';

/**
 * Persist the collapsed state so the next page renders the bar the same way.
 *
 * Failures are ignored: the bar still works, it just will not remember the choice.
 *
 * @param preference The user preference name.
 * @param collapsed The new state.
 */
const saveCollapsed = (preference: string, collapsed: boolean): void => {
    fetchOne({
        methodname: 'core_user_update_user_preferences',
        args: {preferences: [{type: preference, value: collapsed ? '1' : '0'}]},
    }).catch(() => undefined);
};

/**
 * Render the left bar.
 *
 * @param props Component props, built by theme_retani_studio\output\left_bar.
 * @returns The bar.
 */
export default function LeftBar({
    collapsed: initiallycollapsed,
    preference,
    brand,
    categories,
    navigation,
    footernavigation,
    user,
    strings,
}: LeftBarProps) {
    const [collapsed, setCollapsed] = useState<boolean>(initiallycollapsed);
    const [openmenu, setOpenmenu] = useState<OpenMenu>(null);

    // Keep the page layout in step: the body class sets how much room the rest of the page leaves for the bar.
    useEffect(() => {
        document.body.classList.toggle(COLLAPSED_CLASS, collapsed);
    }, [collapsed]);

    const setAndSave = useCallback((value: boolean) => {
        setCollapsed(value);
        setOpenmenu(null);
        saveCollapsed(preference, value);
    }, [preference]);

    const toggleCollapsed = useCallback(() => setAndSave(!collapsed), [collapsed, setAndSave]);
    const expand = useCallback(() => setAndSave(false), [setAndSave]);
    const closeMenus = useCallback(() => setOpenmenu(null), []);
    const toggleMenu = (menu: Exclude<OpenMenu, null>) => () => setOpenmenu((current) => (current === menu ? null : menu));

    const togglelabel = collapsed ? strings.expand : strings.collapse;

    return (
        <div className={`retani-leftbar-inner${collapsed ? ' is-collapsed' : ''}`}>
            <div className="retani-leftbar-header">
                {!collapsed && (
                    <a className="retani-leftbar-brand" href={brand.url}>
                        {brand.logourl ? (
                            <img className="retani-leftbar-logo" src={brand.logourl} alt={brand.name} />
                        ) : (
                            <span className="retani-leftbar-sitename">
                                {brand.name}<span className="retani-leftbar-sitename-dot" aria-hidden="true">.</span>
                            </span>
                        )}
                    </a>
                )}
                <button
                    type="button"
                    className="retani-leftbar-collapse"
                    aria-expanded={!collapsed}
                    aria-label={togglelabel}
                    title={togglelabel}
                    onClick={toggleCollapsed}
                >
                    <Icon name="sidebar" size={16} strokeWidth={1.6} />
                </button>
            </div>

            <CategorySelector
                data={categories}
                collapsed={collapsed}
                open={openmenu === 'category'}
                onToggle={toggleMenu('category')}
                onClose={closeMenus}
                strings={strings}
            />

            <nav className="retani-leftbar-nav" aria-label={strings.navigation}>
                <NavigationMenu items={navigation} collapsed={collapsed} onExpand={expand} />
            </nav>

            {footernavigation.length > 0 && (
                <div className="retani-leftbar-footer">
                    <NavigationMenu items={footernavigation} collapsed={collapsed} onExpand={expand}
                        className="is-footer" />
                </div>
            )}

            <UserMenu
                user={user}
                collapsed={collapsed}
                open={openmenu === 'user'}
                onToggle={toggleMenu('user')}
                onClose={closeMenus}
                label={strings.usermenu}
            />
        </div>
    );
}
