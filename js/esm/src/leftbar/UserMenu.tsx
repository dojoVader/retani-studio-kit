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
 * User menu pinned to the bottom of the left bar.
 *
 * @module     theme_retani_studio/leftbar/UserMenu
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useId, useRef} from 'react';
import {Caret} from './icons';
import useDismiss from './useDismiss';
import type {User} from './types';

export interface UserMenuProps {
    user: User;
    collapsed: boolean;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    /** Accessible name of the toggle, e.g. "User menu". */
    label: string;
}

/**
 * The user's picture, or their initials when they have not uploaded one.
 *
 * @param props Component props.
 * @param props.user The user.
 * @returns The avatar.
 */
function Avatar({user}: {user: User}) {
    return (
        <span className="retani-leftbar-avatar" aria-hidden="true">
            {user.hasavatar ? <img src={user.avatarurl} alt="" /> : user.initials}
        </span>
    );
}

/**
 * Render the signed-in user with a dropdown of the core user menu links (profile, grades, log out...).
 *
 * The dropdown opens upwards, since the toggle sits at the bottom of the screen.
 *
 * @param props Component props.
 * @returns The user menu.
 */
export default function UserMenu({user, collapsed, open, onToggle, onClose, label}: UserMenuProps) {
    const wrapper = useRef<HTMLDivElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
    const menuid = useId();
    useDismiss(open, wrapper, onClose, toggle);

    return (
        <div className={`retani-leftbar-user${open ? ' is-open' : ''}`} ref={wrapper}>
            {open && (
                <div className="retani-leftbar-dropdown retani-leftbar-usermenu" id={menuid}>
                    <div className="retani-leftbar-dropdown-heading retani-leftbar-userdetails">
                        <span className="retani-leftbar-username">{user.fullname}</span>
                        {user.email && <span className="retani-leftbar-useremail">{user.email}</span>}
                    </div>
                    <ul className="retani-leftbar-userlist">
                        {user.items.map((item) => (
                            <li key={item.key} className={item.divider ? 'has-divider' : undefined}>
                                <a className={`retani-leftbar-useroption${item.danger ? ' is-danger' : ''}`}
                                    href={item.url}>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                ref={toggle}
                type="button"
                className="retani-leftbar-usertoggle"
                aria-expanded={open}
                aria-controls={menuid}
                aria-label={`${label}: ${user.fullname}`}
                title={collapsed ? user.fullname : undefined}
                onClick={onToggle}
            >
                <Avatar user={user} />
                {!collapsed && (
                    <>
                        <span className="retani-leftbar-usertext">
                            <span className="retani-leftbar-username">{user.fullname}</span>
                            <span className="retani-leftbar-userrole">{user.role || user.email}</span>
                        </span>
                        <Caret up />
                    </>
                )}
            </button>
        </div>
    );
}
