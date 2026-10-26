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
 * Retractable left bar: brand, course category selector, current course and its outline, navigation menu and
 * user menu.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/leftbar/LeftBar"
 * by core/react_autoinit, from the {{#react}} helper in theme_retani_studio/retani/left_bar.
 *
 * @module     theme_retani_studio/leftbar/LeftBar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useEffect, useId, useState} from 'react';
import {fetchOne} from '@moodle/lms/core/ajax';
import CategorySelector from './CategorySelector';
import {CourseOutline, CourseRow} from './CourseOutline';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';
import {Icon} from './icons';
import type {LeftBarProps, OpenMenu} from './types';

/** Body class the page layout uses to narrow the space reserved for the bar. */
export const COLLAPSED_CLASS = 'retani-leftbar-collapsed';

/**
 * Persist a boolean bar state (collapsed, outline shown) so the next page renders the bar the same way.
 *
 * Failures are ignored: the bar still works, it just will not remember the choice.
 *
 * @param preference The user preference name.
 * @param value The new state.
 */
const savePreference = (preference: string, value: boolean): void => {
    fetchOne({
        methodname: 'core_user_update_user_preferences',
        args: {preferences: [{type: preference, value: value ? '1' : '0'}]},
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
    mobile = false,
    preference,
    brand,
    categories,
    course,
    navigation,
    footernavigation,
    user,
    strings,
}: LeftBarProps) {
    const [collapsed, setCollapsed] = useState<boolean>(!mobile && initiallycollapsed);
    const [openmenu, setOpenmenu] = useState<OpenMenu>(null);
    const [outlineopen, setOutlineopen] = useState<boolean>(course?.outlineopen ?? false);
    const outlineid = useId();

    // Keep the page layout in step: the body class sets how much room the rest of the page leaves for the bar.
    // The mobile copy sits in a drawer and must leave the desktop bar's layout alone.
    useEffect(() => {
        if (!mobile) {
            document.body.classList.toggle(COLLAPSED_CLASS, collapsed);
        }
    }, [collapsed, mobile]);

    const setAndSave = useCallback((value: boolean) => {
        setCollapsed(value);
        setOpenmenu(null);
        savePreference(preference, value);
    }, [preference]);

    const toggleCollapsed = useCallback(() => setAndSave(!collapsed), [collapsed, setAndSave]);
    const expand = useCallback(() => setAndSave(false), [setAndSave]);
    const closeMenus = useCallback(() => setOpenmenu(null), []);
    const toggleMenu = (menu: Exclude<OpenMenu, null>) => () => setOpenmenu((current) => (current === menu ? null : menu));

    // The "Current course" row toggles the outline; on a collapsed bar it expands the bar with the outline open.
    const toggleOutline = useCallback(() => {
        if (!course) {
            return;
        }
        const value = collapsed ? true : !outlineopen;
        if (collapsed) {
            setAndSave(false);
        }
        setOutlineopen(value);
        savePreference(course.preference, value);
    }, [course, collapsed, outlineopen, setAndSave]);

    // As in the mockup, the outline takes the place of the navigation menu while it is shown.
    const outlineshown = Boolean(course) && !collapsed && outlineopen;

    const togglelabel = collapsed ? strings.expand : strings.collapse;

    return (
        <div className={`retani-leftbar-inner${collapsed ? ' is-collapsed' : ''}${mobile ? ' is-mobile' : ''}`}>
            {/* The mobile drawer has its own heading with the brand and a close button. */}
            {!mobile && <div className="retani-leftbar-header">
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
            </div>}

            <CategorySelector
                data={categories}
                collapsed={collapsed}
                open={openmenu === 'category'}
                onToggle={toggleMenu('category')}
                onClose={closeMenus}
                strings={strings}
            />

            {course && (
                <>
                    <CourseRow
                        course={course}
                        collapsed={collapsed}
                        open={outlineshown}
                        onToggle={toggleOutline}
                        strings={strings}
                        panelid={outlineid}
                    />
                    <CourseOutline visible={outlineshown} id={outlineid} label={strings.courseoutline} />
                </>
            )}

            <nav className="retani-leftbar-nav" aria-label={strings.navigation} hidden={outlineshown}>
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
