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

    // Login page: the image carousel on the left panel.
    $page = new admin_settingpage('theme_retani_studio_login', get_string('loginsettings', 'theme_retani_studio'));
    $page->add(new admin_setting_heading('theme_retani_studio/loginslidesheading',
        get_string('loginslidesheading', 'theme_retani_studio'), get_string('loginslidesheading_desc', 'theme_retani_studio')));
    $max = \theme_retani_studio\output\login_carousel::MAX_SLIDES;
    $page->add(new admin_setting_configselect('theme_retani_studio/loginslides',
        get_string('loginslides', 'theme_retani_studio'), get_string('loginslides_desc', 'theme_retani_studio'),
        $max, array_combine(range(0, $max), range(0, $max))));
    for ($i = 1; $i <= $max; $i++) {
        $str = fn(string $key) => get_string($key, 'theme_retani_studio', $i);
        $page->add(new admin_setting_heading("theme_retani_studio/loginslide{$i}heading", $str('loginslideheading'), ''));
        $default = fn(string $part) => get_string('loginslidedefault_desc', 'theme_retani_studio',
            get_string("loginslide{$i}{$part}_default", 'theme_retani_studio'));
        $page->add(new admin_setting_configtext("theme_retani_studio/loginslide{$i}title", $str('loginslidetitle'),
            $default('title'), '', PARAM_TEXT));
        $page->add(new admin_setting_configtextarea("theme_retani_studio/loginslide{$i}body", $str('loginslidebody'),
            $default('body'), '', PARAM_TEXT));
        $setting = new admin_setting_configstoredfile("theme_retani_studio/loginslide{$i}image", $str('loginslideimage'),
            $str('loginslideimage_desc'), "loginslide{$i}image", 0, ['maxfiles' => 1, 'accepted_types' => ['web_image']]);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $page->add($setting);
        $page->add(new admin_setting_configtext("theme_retani_studio/loginslide{$i}alt", $str('loginslidealt'),
            $str('loginslidealt_desc') . ' ' . $default('alt'), '', PARAM_TEXT));
        // Hide the fields of slides beyond the number shown.
        $fewer = implode('|', range(0, $i - 1));
        foreach (['title', 'body', 'image', 'alt'] as $part) {
            $settings->hide_if("theme_retani_studio/loginslide{$i}{$part}", 'theme_retani_studio/loginslides', 'in', $fewer);
        }
    }
    $settings->add($page);

    // Front page: the landing page drawn by layout/frontpage.php. Text settings default to the text of the design, and
    // a text setting left empty hides what it fills.
    $fp = \theme_retani_studio\output\frontpage::class;
    $str = fn(string $key, $a = null) => get_string($key, 'theme_retani_studio', $a);
    $desc = fn(string $key) => get_string_manager()->string_exists($key, 'theme_retani_studio') ? $str($key) : '';
    $heading = function(admin_settingpage $page, string $name) use ($str, $desc): void {
        $page->add(new admin_setting_heading("theme_retani_studio/fp{$name}heading", $str("fpheading_{$name}"),
            $desc("fpheading_{$name}_desc")));
    };
    // A text setting. $title is the name of the setting when it is not "fp{$name}" in the language file.
    $text = function(admin_settingpage $page, string $name, bool $multiline = false, ?string $title = null,
            string $description = '') use ($fp, $str, $desc): void {
        $title ??= $str("fp{$name}");
        $description = $description ?: $desc("fp{$name}_desc");
        $default = $fp::default_text($name);
        $settingname = "theme_retani_studio/fp{$name}";
        $page->add($multiline
            ? new admin_setting_configtextarea($settingname, $title, $description, $default, PARAM_TEXT, 60, 4)
            : new admin_setting_configtext($settingname, $title, $description, $default, PARAM_TEXT));
    };
    $image = function(admin_settingpage $page, string $name, ?string $title = null) use ($str): void {
        $setting = new admin_setting_configstoredfile("theme_retani_studio/fp{$name}", $title ?? $str("fp{$name}"),
            $str('fpimage_desc'), "fp{$name}", 0, ['maxfiles' => 1, 'accepted_types' => ['web_image']]);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $page->add($setting);
    };
    // The eyebrow label and heading of a section.
    $sectionheader = function(admin_settingpage $page, string $section) use ($text, $str): void {
        $text($page, "{$section}tag", false, $str('fpsectiontag'), $str('fpsectiontag_desc'));
        $text($page, "{$section}heading", false, $str('fpsectionheading'));
    };
    $badge = function(admin_settingpage $page, string $section) use ($text, $str): void {
        $text($page, "{$section}badgevalue", false, $str('fpbadgevalue'), $str('fpbadge_desc'));
        $text($page, "{$section}badgelabel", false, $str('fpbadgelabel'));
    };
    $counts = fn(int $max) => array_combine(range(0, $max), range(0, $max));

    // Front page: general, hero, features, courses, about and statistics.
    $page = new admin_settingpage('theme_retani_studio_frontpage', $str('frontpagesettings'));
    $heading($page, 'general');
    $page->add(new admin_setting_configcheckbox('theme_retani_studio/fpenabled', $str('fpenabled'),
        $str('fpenabled_desc'), 1));
    $page->add(new admin_setting_configcheckbox('theme_retani_studio/fpcourselisting', $str('fpcourselisting'),
        $str('fpcourselisting_desc'), 1));
    $page->add(new admin_setting_configcheckbox('theme_retani_studio/fpmodetoggle', $str('fpmodetoggle'),
        $str('fpmodetoggle_desc'), 1));
    $sections = [];
    foreach ($fp::SECTIONS as $section) {
        $sections[$section] = $str("fpsection_{$section}");
    }
    $page->add(new admin_setting_configmulticheckbox('theme_retani_studio/fpsections', $str('fpsections'),
        $str('fpsections_desc'), array_fill_keys($fp::DEFAULT_SECTIONS, 1), $sections));
    $text($page, 'announcement');

    $heading($page, 'hero');
    $text($page, 'herotitle');
    $text($page, 'herotext', true);
    $text($page, 'herobutton', false, $str('fpbutton'));
    $text($page, 'herourl', false, $str('fpurl'), $str('fpurl_desc'));
    $image($page, 'heroimage', $str('fpimage'));
    $text($page, 'heroimagealt', false, $str('fpimagealt'), $str('fpimagealt_desc'));
    $badge($page, 'hero');

    $heading($page, 'features');
    for ($i = 1; $i <= $fp::FEATURES; $i++) {
        $text($page, "feature{$i}title", false, $str('fpfeaturetitle', $i));
        $text($page, "feature{$i}text", true, $str('fpfeaturetext', $i));
        $text($page, "feature{$i}url", false, $str('fpfeatureurl', $i), $str('fpurl_desc'));
    }

    $heading($page, 'courses');
    $sectionheader($page, 'courses');
    $page->add(new admin_setting_configtext('theme_retani_studio/fpcourseids', $str('fpcourseids'),
        $str('fpcourseids_desc'), '', PARAM_SEQUENCE));
    $page->add(new admin_setting_configselect('theme_retani_studio/fpcoursescount', $str('fpcoursescount'),
        $str('fpcoursescount_desc'), 8, array_combine($fp::COURSE_COUNTS, $fp::COURSE_COUNTS)));

    $heading($page, 'about');
    $sectionheader($page, 'about');
    $text($page, 'abouttext', true, $str('fptext'));
    $text($page, 'aboutpoints', true);
    $text($page, 'aboutbutton', false, $str('fpbutton'));
    $text($page, 'abouturl', false, $str('fpurl'), $str('fpurl_desc'));
    $image($page, 'aboutimage', $str('fpimage'));
    $text($page, 'aboutimagealt', false, $str('fpimagealt'), $str('fpimagealt_desc'));
    $badge($page, 'about');

    $heading($page, 'stats');
    $text($page, 'statsheading', false, $str('fpsectionheading'));
    for ($i = 1; $i <= $fp::STATS; $i++) {
        $text($page, "stat{$i}value", false, $str('fpstatvalue', $i));
        $text($page, "stat{$i}label", false, $str('fpstatlabel', $i));
    }
    $settings->add($page);

    // Front page: instructors, testimonials and the call for instructors.
    $page = new admin_settingpage('theme_retani_studio_frontpagepeople', $str('frontpagepeoplesettings'));
    $heading($page, 'instructors');
    $sectionheader($page, 'instructors');
    $page->add(new admin_setting_configselect('theme_retani_studio/fpinstructorscount', $str('fpinstructorscount'),
        '', 4, $counts($fp::MAX_INSTRUCTORS)));
    for ($i = 1; $i <= $fp::MAX_INSTRUCTORS; $i++) {
        $text($page, "instructor{$i}name", false, $str('fpinstructorname', $i));
        $text($page, "instructor{$i}role", false, $str('fpinstructorrole', $i));
        $image($page, "instructor{$i}image", $str('fpinstructorimage', $i));
        $fewer = implode('|', range(0, $i - 1));
        foreach (['name', 'role', 'image'] as $part) {
            $settings->hide_if("theme_retani_studio/fpinstructor{$i}{$part}", 'theme_retani_studio/fpinstructorscount',
                'in', $fewer);
        }
    }

    $heading($page, 'testimonials');
    $sectionheader($page, 'testimonials');
    $page->add(new admin_setting_configselect('theme_retani_studio/fptestimonialscount', $str('fptestimonialscount'),
        $str('fptestimonialscount_desc'), 2, $counts($fp::MAX_TESTIMONIALS)));
    for ($i = 1; $i <= $fp::MAX_TESTIMONIALS; $i++) {
        $text($page, "testimonial{$i}quote", true, $str('fptestimonialquote', $i));
        $text($page, "testimonial{$i}name", false, $str('fptestimonialname', $i));
        $text($page, "testimonial{$i}role", false, $str('fptestimonialrole', $i));
        $image($page, "testimonial{$i}image", $str('fptestimonialimage', $i));
        $fewer = implode('|', range(0, $i - 1));
        foreach (['quote', 'name', 'role', 'image'] as $part) {
            $settings->hide_if("theme_retani_studio/fptestimonial{$i}{$part}", 'theme_retani_studio/fptestimonialscount',
                'in', $fewer);
        }
    }

    $heading($page, 'teach');
    $sectionheader($page, 'teach');
    $text($page, 'teachtext', true, $str('fptext'));
    foreach ([1, 2] as $i) {
        $text($page, "teachpoint{$i}title", false, $str('fpteachpointtitle', $i));
        $text($page, "teachpoint{$i}text", true, $str('fpteachpointtext', $i));
    }
    $text($page, 'teachbutton', false, $str('fpbutton'));
    $text($page, 'teachurl', false, $str('fpurl'), $str('fpteachurl_desc'));
    $image($page, 'teachimage', $str('fpimage'));
    $text($page, 'teachimagealt', false, $str('fpimagealt'), $str('fpimagealt_desc'));
    $badge($page, 'teach');
    $settings->add($page);

    // Front page: news, the call to action and the footer.
    $page = new admin_settingpage('theme_retani_studio_frontpagefooter', $str('frontpagefootersettings'));
    $heading($page, 'news');
    $sectionheader($page, 'news');
    $page->add(new admin_setting_configselect('theme_retani_studio/fpnewscount', $str('fpnewscount'),
        $str('fpnewscount_desc'), 3, $counts(6)));
    $text($page, 'newsbutton', false, $str('fpbutton'));

    $heading($page, 'cta');
    $text($page, 'ctaheading', false, $str('fpsectionheading'), $str('fpctaheading_desc'));
    $text($page, 'ctatext', true, $str('fptext'));
    $text($page, 'ctabutton', false, $str('fpbutton'));
    $text($page, 'ctaurl', false, $str('fpurl'), $str('fpurl_desc'));

    $heading($page, 'footer');
    $text($page, 'footertext', true);
    foreach ($fp::SOCIALS as $network) {
        $text($page, "social{$network}", false, $str('fpsociallink', $str("fpsocial{$network}")), $str('fpsocial_desc'));
    }
    foreach ([1, 2] as $i) {
        $text($page, "footercol{$i}title", false, $str('fpfootercoltitle', $i));
        $text($page, "footercol{$i}links", true, $str('fpfootercollinks', $i), $str('fplinks_desc'));
    }
    $text($page, 'contacttitle');
    $text($page, 'address');
    $text($page, 'email');
    $text($page, 'phone');
    $text($page, 'copyright');
    $text($page, 'legallinks', true, null, $str('fplinks_desc'));
    $settings->add($page);

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

    // Dark mode for the Site administration pages, for site administrators. Separate from the colour modes below:
    // it does not need them to be on, and does not change anybody's colour mode.
    $page->add(new admin_setting_configcheckbox('theme_retani_studio/admindarkmode',
        get_string('admindarkmode', 'theme_retani_studio'), get_string('admindarkmode_desc', 'theme_retani_studio'), 1));

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
