<?php
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

namespace theme_retani_studio\output;

use core\output\renderable;
use core\output\renderer_base;
use core\output\templatable;
use core\url;
use moodle_page;

/**
 * The right-hand block bar: the page's side-pre blocks in a bar that expands and collapses.
 *
 * Replaces the Boost block drawer. The bar is the theme_retani_studio/blocksidebar/BlockSidebar React component
 * (header, collapsed "Blocks" tab and the "Add a block" dialog); the blocks themselves are rendered by Moodle
 * and moved into the component, so each block keeps its own markup and JavaScript.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_sidebar implements renderable, templatable {
    /** @var string User preference holding whether the bar is open (the same one the Boost block drawer used). */
    public const PREFERENCE = 'drawer-open-block';

    /** @var string The block region shown in the bar. */
    public const REGION = 'side-pre';

    /**
     * Constructor.
     *
     * @param moodle_page $page The page.
     * @param string $blockshtml The rendered blocks of the region.
     * @param bool $open Whether the bar starts open.
     */
    public function __construct(
        /** @var moodle_page The page. */
        protected moodle_page $page,
        /** @var string The rendered blocks of the region. */
        protected string $blockshtml,
        /** @var bool Whether the bar starts open. */
        protected bool $open,
    ) {
    }

    /**
     * Whether the bar has anything to show: blocks, or the option to add one.
     *
     * @param moodle_page $page The page.
     * @param string $blockshtml The rendered blocks of the region.
     * @return bool
     */
    public static function has_content(moodle_page $page, string $blockshtml): bool {
        return str_contains($blockshtml, 'data-block=') || self::can_add_blocks($page);
    }

    /**
     * Whether blocks can be added to the bar on this page now (edit mode is on).
     *
     * Mirrors the checks of core_renderer::addblockbutton().
     *
     * @param moodle_page $page The page.
     * @return bool
     */
    public static function can_add_blocks(moodle_page $page): bool {
        return isset($page->theme->addblockposition)
            && $page->user_is_editing()
            && $page->user_can_edit_blocks()
            && $page->pagelayout !== 'mycourses'
            && in_array(self::REGION, $page->blocks->get_regions());
    }

    /**
     * Export the bar for theme_retani_studio/retani/block_sidebar.
     *
     * @param renderer_base $output
     * @return array
     */
    public function export_for_template(renderer_base $output): array {
        $canadd = self::can_add_blocks($this->page);
        $addblock = null;
        if ($canadd) {
            // The address core's add block links use; the dialog adds bui_addblock=<block name>.
            $addurl = new url($this->page->url, ['sesskey' => sesskey(), 'bui_blockregion' => self::REGION]);
            $addblock = [
                'url' => $addurl->out(false),
                'pagehash' => $this->page->get_edited_page_hash(),
                'region' => self::REGION,
            ];
        }

        $props = [
            'open' => $this->open,
            'preference' => self::PREFERENCE,
            'editing' => $this->page->user_is_editing(),
            'addblock' => $addblock,
            'strings' => [
                'blocks' => get_string('blocks'),
                'open' => get_string('opendrawerblocks', 'core'),
                'close' => get_string('closeblockdrawer', 'core'),
                'addblock' => get_string('addblock'),
                'addblockhint' => get_string('blocksidebar:addblockhint', 'theme_retani_studio'),
                'search' => get_string('blocksidebar:search', 'theme_retani_studio'),
                'nomatch' => get_string('blocksidebar:nomatch', 'theme_retani_studio'),
                'noblocks' => get_string('noblockstoaddhere'),
                'add' => get_string('blocksidebar:add', 'theme_retani_studio'),
                'cancel' => get_string('cancel'),
                'closebuttontitle' => get_string('closebuttontitle'),
                'loading' => get_string('blocksidebar:loading', 'theme_retani_studio'),
            ],
        ];

        return [
            'reactprops' => json_encode($props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'open' => $this->open,
            'blocks' => $this->blockshtml,
            'strings' => $props['strings'],
        ];
    }
}
