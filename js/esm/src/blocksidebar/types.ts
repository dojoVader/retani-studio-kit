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
 * Types for the block bar, matching the props built by theme_retani_studio\output\block_sidebar.
 *
 * @module     theme_retani_studio/blocksidebar/types
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export interface BlockSidebarStrings {
    blocks: string;
    open: string;
    close: string;
    addblock: string;
    addblockhint: string;
    search: string;
    /** "No blocks match “{$a}”": {$a} is replaced with the search text. */
    nomatch: string;
    noblocks: string;
    add: string;
    cancel: string;
    closebuttontitle: string;
    loading: string;
}

/** Where and how blocks are added, when edit mode is on. */
export interface AddBlockConfig {
    /** The page address with sesskey and bui_blockregion; bui_addblock=<name> is added to it. */
    url: string;
    pagehash: string;
    region: string;
}

export interface BlockSidebarProps {
    open: boolean;
    preference: string;
    editing: boolean;
    addblock: AddBlockConfig | null;
    strings: BlockSidebarStrings;
}

/** A block that can be added, from core_block_fetch_addable_blocks. */
export interface AddableBlock {
    name: string;
    title: string;
    /** Class name of the block's add form, when it asks for settings before it is added. */
    blockform: string | null;
}
