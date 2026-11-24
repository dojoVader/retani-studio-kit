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

namespace theme_retani_studio;

use moodle_page;

/**
 * Dark mode for the Site administration pages, for site administrators.
 *
 * Separate from the colour modes (see colour_mode): it does not use the data-bs-theme attribute, the colour mode
 * switcher or its preference. Each administrator turns it on or off with a toggle in the navbar of the administration
 * pages (self::PREFERENCE, on by default). When it applies, the html tag carries the retani-admin-dark class, and scss/retani_admindark.scss gives that
 * class every dark override of Bootstrap and the theme, plus its own for the administration components. Pages for
 * everybody else, and the rest of the site for administrators, are not affected.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class admin_dark_mode {
    /** @var string The class on the html tag which turns the administration pages dark. */
    public const CSS_CLASS = 'retani-admin-dark';

    /** @var string The user preference holding whether an administrator wants the dark mode: 1 (the default) or 0. */
    public const PREFERENCE = 'theme_retani_studio_admindark';

    /**
     * Whether the administration dark mode is turned on in the theme settings.
     *
     * @return bool
     */
    public static function is_enabled(): bool {
        return (bool) get_config('theme_retani_studio', 'admindarkmode');
    }

    /**
     * Whether a page is a Site administration page.
     *
     * @param moodle_page $page
     * @return bool
     */
    public static function is_admin_page(moodle_page $page): bool {
        if ($page->pagelayout === 'admin') {
            return true;
        }
        return $page->has_set_url() && str_starts_with($page->url->get_path(false), '/admin/');
    }

    /**
     * Whether the dark mode can be used on the page: an administration page, seen by a site administrator, with the
     * setting on. The toggle is shown on these pages.
     *
     * Never during installation or upgrade, when the settings and the session cannot be relied on.
     *
     * @param moodle_page $page
     * @return bool
     */
    public static function is_available(moodle_page $page): bool {
        if (during_initial_install() || $page->pagelayout === 'maintenance' || !self::is_enabled()) {
            return false;
        }
        if (!colour_mode::is_retani_studio_theme() || !is_siteadmin()) {
            return false;
        }
        // Where the colour mode menu is in the navbar, it is the one control: the administration pages follow the
        // mode chosen there, and this dark mode and its toggle stand down so that there are not two.
        if (colour_mode::can_choose_mode()) {
            return false;
        }
        return self::is_admin_page($page);
    }

    /**
     * Whether the administrator has the dark mode on. It is on until they turn it off with the toggle.
     *
     * @return bool
     */
    public static function is_chosen(): bool {
        return (bool) get_user_preferences(self::PREFERENCE, 1);
    }

    /**
     * Whether the page is drawn dark: the dark mode is available on it and the administrator has it on.
     *
     * @param moodle_page $page
     * @return bool
     */
    public static function applies(moodle_page $page): bool {
        return self::is_available($page) && self::is_chosen();
    }

    /**
     * The toggle between the light and dark administration pages, for the navbar.
     *
     * @param moodle_page $page
     * @param \renderer_base $output
     * @return string The toggle, or an empty string where the dark mode is not available.
     */
    public static function render_toggle(moodle_page $page, \renderer_base $output): string {
        if (!self::is_available($page)) {
            return '';
        }
        $dark = self::is_chosen();
        return $output->render_from_template('theme_retani_studio/admin_dark_toggle', [
            'dark' => $dark,
            'preference' => self::PREFERENCE,
            'cssclass' => self::CSS_CLASS,
            'label' => get_string('admindarktoggle', 'theme_retani_studio'),
        ]);
    }
}
