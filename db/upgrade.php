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

/**
 * Upgrade steps for the Retani Studio theme.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Upgrade the theme.
 *
 * @param int $oldversion
 * @return bool
 */
function xmldb_theme_retani_studio_upgrade($oldversion) {
    global $DB;

    if ($oldversion < 2026102604) {
        // The landing page and course catalogue were removed: drop their settings and uploaded images.
        $fs = get_file_storage();
        $syscontext = \context_system::instance();
        $like = $DB->sql_like('name', ':prefix');
        $names = $DB->get_fieldset_select('config_plugins', 'name', "plugin = :plugin AND $like",
            ['plugin' => 'theme_retani_studio', 'prefix' => $DB->sql_like_escape('fp_') . '%']);
        foreach ($names as $name) {
            $fs->delete_area_files($syscontext->id, 'theme_retani_studio', $name);
            unset_config($name, 'theme_retani_studio');
        }
        upgrade_plugin_savepoint(true, 2026102604, 'theme', 'retani_studio');
    }
    return true;
}
