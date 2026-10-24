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
 * Prop types for the left bar, mirroring theme_retani_studio\output\left_bar::export_for_template().
 *
 * @module     theme_retani_studio/leftbar/types
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** Names of the icons the bar knows how to draw (see ./icons). */
export type IconName =
    | 'dashboard' | 'calendar' | 'courses' | 'management' | 'users' | 'grades' | 'reports'
    | 'badges' | 'competencies' | 'admin' | 'help' | 'sidebar' | 'outline';

export interface Brand {
    name: string;
    url: string;
    logourl: string | null;
}

export interface Category {
    id: number;
    name: string;
    /** The category idnumber; may be empty. */
    code: string;
    coursecount: number;
    url: string;
}

export interface CategoryData {
    items: Category[];
    selected: number | null;
    manageurl: string | null;
    managelabel: string | null;
}

/** The course of the current page, whose index the bar can show as the course outline. */
export interface CurrentCourse {
    id: number;
    name: string;
    url: string;
    /** Whether the outline is shown (instead of the navigation menu) when the page loads. */
    outlineopen: boolean;
    /** Name of the user preference that stores whether the outline is shown. */
    preference: string;
}

export interface NavChild {
    label: string;
    url: string;
    active: boolean;
}

export interface NavItem {
    key: string;
    label: string;
    icon: IconName;
    url: string;
    active: boolean;
    external: boolean;
    children: NavChild[];
}

export interface UserMenuItem {
    key: string;
    label: string;
    url: string;
    /** Draw a separator above this item. */
    divider: boolean;
    /** Destructive action, e.g. Log out. */
    danger: boolean;
}

export interface User {
    fullname: string;
    email: string;
    role: string;
    initials: string;
    avatarurl: string;
    hasavatar: boolean;
    items: UserMenuItem[];
}

export interface LeftBarStrings {
    collapse: string;
    expand: string;
    navigation: string;
    switchcategory: string;
    categories: string;
    /** Course count label with {$a} for the number. */
    coursecount: string;
    usermenu: string;
    currentcourse: string;
    courseoutline: string;
}

export interface LeftBarProps {
    collapsed: boolean;
    /** Rendered inside the mobile primary drawer: no header, no collapse button, no page layout changes. */
    mobile?: boolean;
    /** Name of the user preference that stores the collapsed state. */
    preference: string;
    brand: Brand;
    categories: CategoryData;
    /** Null on pages that do not belong to a course with a course index. */
    course: CurrentCourse | null;
    navigation: NavItem[];
    footernavigation: NavItem[];
    user: User;
    strings: LeftBarStrings;
}

/** The dropdowns that can be open; only one is open at a time. */
export type OpenMenu = 'category' | 'user' | null;
