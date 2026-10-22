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
 * @package   theme_retani_studio
 * @copyright 2016 Ryan Wyllie
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * @var $ADMIN admin_root
 */

if ($ADMIN->fulltree) {
    $settings = new theme_retani_studio_admin_settingspage_tabs('themesettingretani_studio', get_string('configtitle', 'theme_retani_studio'));
    $page = new admin_settingpage('theme_retani_studio_general', get_string('generalsettings', 'theme_retani_studio'));

    // Unaddable blocks.
    // Blocks to be excluded when this theme is enabled in the "Add a block" list: Administration, Navigation and Courses.
    $default = 'navigation,settings,course_list';
    $setting = new admin_setting_configtext('theme_retani_studio/unaddableblocks',
        get_string('unaddableblocks', 'theme_retani_studio'), get_string('unaddableblocks_desc', 'theme_retani_studio'), $default, PARAM_TEXT);
    $page->add($setting);

    // Preset.
    $name = 'theme_retani_studio/preset';
    $title = get_string('preset', 'theme_retani_studio');
    $description = get_string('preset_desc', 'theme_retani_studio');
    $default = 'default.scss';

    $context = context_system::instance();
    $fs = get_file_storage();
    $files = $fs->get_area_files($context->id, 'theme_retani_studio', 'preset', 0, 'itemid, filepath, filename', false);

    $choices = [];
    foreach ($files as $file) {
        $choices[$file->get_filename()] = $file->get_filename();
    }
    // These are the built in presets.
    $choices['default.scss'] = 'default.scss';
    $choices['plain.scss'] = 'plain.scss';
    $choices['preset-retani.scss'] = 'preset-retani.scss';

    $setting = new admin_setting_configthemepreset($name, $title, $description, $default, $choices, 'retani_studio');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Preset files setting.
    $name = 'theme_retani_studio/presetfiles';
    $title = get_string('presetfiles','theme_retani_studio');
    $description = get_string('presetfiles_desc', 'theme_retani_studio');

    $setting = new admin_setting_configstoredfile($name, $title, $description, 'preset', 0,
        array('maxfiles' => 20, 'accepted_types' => array('.scss')));
    $page->add($setting);

    // Background image setting.
    $name = 'theme_retani_studio/backgroundimage';
    $title = get_string('backgroundimage', 'theme_retani_studio');
    $description = get_string('backgroundimage_desc', 'theme_retani_studio');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'backgroundimage');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Login Background image setting.
    $name = 'theme_retani_studio/loginbackgroundimage';
    $title = get_string('loginbackgroundimage', 'theme_retani_studio');
    $description = get_string('loginbackgroundimage_desc', 'theme_retani_studio');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'loginbackgroundimage');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Logo shown on the login page.
    $name = 'theme_retani_studio/logo';
    $title = get_string('logo', 'theme_retani_studio');
    $description = get_string('logo_desc', 'theme_retani_studio');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'logo', 0,
        ['maxfiles' => 1, 'accepted_types' => ['web_image']]);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // We use an empty default value because the default colour should come from the preset.
    $name = 'theme_retani_studio/brandcolor';
    $title = get_string('brandcolor', 'theme_retani_studio');
    $description = get_string('brandcolor_desc', 'theme_retani_studio');
    $setting = new admin_setting_configcolourpicker($name, $title, $description, '');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Must add the page after definiting all the settings!
    $settings->add($page);

    // Front page (site home landing page) tabs.
    require(__DIR__ . '/settings/frontpage.php');

    // Advanced settings.
    $page = new admin_settingpage('theme_retani_studio_advanced', get_string('advancedsettings', 'theme_retani_studio'));

    // Raw SCSS to include before the content.
    $setting = new admin_setting_scsscode('theme_retani_studio/scsspre',
        get_string('rawscsspre', 'theme_retani_studio'), get_string('rawscsspre_desc', 'theme_retani_studio'), '', PARAM_RAW);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Raw SCSS to include after the content.
    $setting = new admin_setting_scsscode('theme_retani_studio/scss', get_string('rawscss', 'theme_retani_studio'),
        get_string('rawscss_desc', 'theme_retani_studio'), '', PARAM_RAW);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    $settings->add($page);

    // Experimental settings.
    $page = new admin_settingpage('theme_retani_studio_experimental', get_string('experimentalsettings', 'theme_retani_studio'));

    // Colour modes. Off until a site opts in, because a plugin which has not been checked in dark mode can still
    // draw its pages in light colours.
    $name = 'theme_retani_studio/enablecolourmodes';
    $title = get_string('enablecolourmodes', 'theme_retani_studio');
    $description = get_string('enablecolourmodes_desc', 'theme_retani_studio');
    $setting = new admin_setting_configcheckbox($name, $title, $description, 0);
    $page->add($setting);

    // Light while colour modes are experimental. Following the device would put everyone whose device asks for dark
    // into dark mode the moment a site ticks the setting above, including the guests and users who are not logged in
    // who never get the switcher to change it back. MDL-89379 restores the device default once the components have
    // all been converted.
    $name = 'theme_retani_studio/defaultcolourmode';
    $title = get_string('defaultcolourmode', 'theme_retani_studio');
    $description = get_string('defaultcolourmode_desc', 'theme_retani_studio');
    $choices = [];
    foreach (\theme_retani_studio\colour_mode::get_modes() as $mode) {
        $choices[$mode] = get_string('colourmode:' . $mode, 'theme_retani_studio');
    }
    $setting = new admin_setting_configselect($name, $title, $description, \theme_retani_studio\colour_mode::LIGHT, $choices);
    $page->add($setting);
    // The dependency goes on the tabs page rather than the tab: admin/settings.php reads the dependencies from the
    // top level page, and theme_retani_studio_admin_settingspage_tabs::add_tab() copies a tab's settings up but not its
    // dependencies, so one recorded on the tab never reaches the JavaScript.
    $settings->hide_if('theme_retani_studio/defaultcolourmode', 'theme_retani_studio/enablecolourmodes', 'notchecked');

    $settings->add($page);
}
