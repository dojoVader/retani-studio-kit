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
 * Course category selector dropdown at the top of the left bar.
 *
 * @module     theme_retani_studio/leftbar/CategorySelector
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useId, useRef} from 'react';
import {CATEGORY_STYLES, Caret, Check, Icon} from './icons';
import useDismiss from './useDismiss';
import type {Category, CategoryData, LeftBarStrings} from './types';

export interface CategorySelectorProps {
    data: CategoryData;
    collapsed: boolean;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    strings: Pick<LeftBarStrings, 'switchcategory' | 'categories' | 'coursecount'>;
}

/**
 * Coloured tile with the category glyph.
 *
 * @param props Component props.
 * @param props.index Position of the category, which picks its colour and glyph.
 * @param props.small Use the smaller tile from the dropdown list.
 * @returns The tile.
 */
function CategoryTile({index, small = false}: {index: number; small?: boolean}) {
    const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
    return (
        <span className={`retani-leftbar-cattile${small ? ' is-small' : ''}`} style={{background: style.gradient}}
            aria-hidden="true">
            <Icon path={style.path} size={small ? 16 : 20} />
        </span>
    );
}

/**
 * Secondary line under a category name: its idnumber and/or course count.
 *
 * @param category The category.
 * @param countlabel Course count label with {$a}.
 * @param withcount Whether to include the course count.
 * @returns The text.
 */
const metaLine = (category: Category, countlabel: string, withcount: boolean): string => {
    const count = countlabel.replace('{$a}', String(category.coursecount));
    if (!withcount) {
        return category.code || count;
    }
    return category.code ? `${category.code} · ${count}` : count;
};

/**
 * Render the selected category with a dropdown listing every top-level category.
 *
 * Picking a category opens that category's course listing.
 *
 * @param props Component props.
 * @returns The selector, or nothing when the user can see no categories.
 */
export default function CategorySelector({data, collapsed, open, onToggle, onClose, strings}: CategorySelectorProps) {
    const wrapper = useRef<HTMLDivElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
    const menuid = useId();
    useDismiss(open, wrapper, onClose, toggle);

    if (data.items.length === 0) {
        return null;
    }

    const selectedindex = Math.max(0, data.items.findIndex((c) => c.id === data.selected));
    const selected = data.items[selectedindex];

    return (
        <div className={`retani-leftbar-category${open ? ' is-open' : ''}`} ref={wrapper}>
            <button
                ref={toggle}
                type="button"
                className="retani-leftbar-cattoggle"
                aria-expanded={open}
                aria-controls={menuid}
                title={collapsed ? `${strings.switchcategory}: ${selected.name}` : strings.switchcategory}
                onClick={onToggle}
            >
                <CategoryTile index={selectedindex} />
                {collapsed ? (
                    <span className="visually-hidden">{`${strings.switchcategory}: ${selected.name}`}</span>
                ) : (
                    <>
                        <span className="retani-leftbar-cattext">
                            <span className="retani-leftbar-catname">{selected.name}</span>
                            <span className="retani-leftbar-catmeta">
                                {metaLine(selected, strings.coursecount, false)}
                            </span>
                        </span>
                        <Caret />
                    </>
                )}
            </button>

            {open && (
                <div className="retani-leftbar-dropdown retani-leftbar-catmenu" id={menuid}>
                    <div className="retani-leftbar-dropdown-heading">{strings.categories}</div>
                    <ul className="retani-leftbar-catlist">
                        {data.items.map((category, index) => {
                            const isselected = index === selectedindex;
                            return (
                                <li key={category.id}>
                                    <a
                                        className={`retani-leftbar-catoption${isselected ? ' is-selected' : ''}`}
                                        href={category.url}
                                        aria-current={isselected ? 'true' : undefined}
                                    >
                                        <CategoryTile index={index} small />
                                        <span className="retani-leftbar-cattext">
                                            <span className="retani-leftbar-catname">{category.name}</span>
                                            <span className="retani-leftbar-catmeta">
                                                {metaLine(category, strings.coursecount, true)}
                                            </span>
                                        </span>
                                        <span className="retani-leftbar-catcheck"><Check /></span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    {data.manageurl && (
                        <div className="retani-leftbar-dropdown-footer">
                            <a href={data.manageurl}>{data.managelabel}</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
