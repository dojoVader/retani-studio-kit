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
 * Save the current user's preferences.
 *
 * Use this instead of core_user/repository: in this Moodle version, setUserPreference() posts to the REST router
 * (r.php/api/rest/v2), which is not reachable on every server. There it fails silently and the setting is lost on the
 * next page load. This goes through the core_user_set_user_preferences web service, which works everywhere.
 *
 * @module     theme_retani_studio/preference
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';

/**
 * Save a user preference of the current user.
 *
 * @param {String} name The preference name, which must be registered by a *_user_preferences() callback.
 * @param {String|Number|Boolean} value Booleans are saved as 1 or 0.
 * @return {Promise}
 */
export const setUserPreference = (name, value) => Ajax.call([{
    methodname: 'core_user_set_user_preferences',
    args: {preferences: [{name, value: typeof value === 'boolean' ? (value ? '1' : '0') : String(value), userid: 0}]},
}])[0];
