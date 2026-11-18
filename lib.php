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
 * Theme functions.
 *
 * @package    theme_retani_studio
 * @copyright  2016 Frédéric Massart - FMCorz.net
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Post process the CSS tree.
 *
 * @param string $tree The CSS tree.
 * @param theme_config $theme The theme config object.
 */
function theme_retani_studio_css_tree_post_processor($tree, $theme) {
    error_log('theme_retani_studio_css_tree_post_processor() is deprecated. Required' .
        'prefixes for Bootstrap are now in theme/retani_studio/scss/moodle/prefixes.scss');
    $prefixer = new theme_retani_studio\autoprefixer($tree);
    $prefixer->prefix();
}

/**
 * Inject additional SCSS.
 *
 * @param theme_config $theme The theme config object.
 * @return string
 */
function theme_retani_studio_get_extra_scss($theme) {
    global $CFG;

    $content = '';
    $imageurl = $theme->setting_file_url('backgroundimage', 'backgroundimage');

    // Sets the background image, and its settings.
    if (!empty($imageurl)) {
        $content .= '@media (min-width: 768px) {';
        $content .= 'body { ';
        $content .= "background-image: url('$imageurl'); background-size: cover;";
        $content .= ' } }';
    }

    // Sets the login panel background image. The Retani login panel is a solid dark surface by default,
    // so only an image uploaded in the theme settings is applied; it is darkened in scss/moodle/login.scss.
    $loginbackgroundimageurl = $theme->setting_file_url('loginbackgroundimage', 'loginbackgroundimage');
    if (!empty($loginbackgroundimageurl)) {
        $content .= 'body.pagelayout-login #page .login-layout-left { ';
        $content .= "background-image: url('$loginbackgroundimageurl'); ";
        $content .= 'background-size: cover; background-position: center;';
        $content .= ' }';
        $content .= 'body.pagelayout-login #page .login-layout-left::before { content: ""; }';
    }

    // Get the extra css from the parent theme, if it exists.
    $extracss = $CFG->dirroot . '/theme/retani_studio/scss/post.scss';

    if (file_exists($extracss)) {
        $content .= file_get_contents($extracss);
    }

    // Always return the background image with the scss when we have it.
    return !empty($theme->settings->scss) ? "{$theme->settings->scss}  \n  {$content}" : $content;
}

/**
 * Serves any files associated with the theme settings.
 *
 * @param stdClass $course
 * @param stdClass $cm
 * @param context $context
 * @param string $filearea
 * @param array $args
 * @param bool $forcedownload
 * @param array $options
 * @return bool
 */
function theme_retani_studio_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options = array()) {
    if ($context->contextlevel == CONTEXT_SYSTEM && ($filearea === 'logo' || $filearea === 'backgroundimage' ||
        $filearea === 'loginbackgroundimage' || preg_match('/^loginslide[1-9]image$/', $filearea))) {
        $theme = theme_config::load('retani_studio');
        // By default, theme files must be cache-able by both browsers and proxies.
        if (!array_key_exists('cacheability', $options)) {
            $options['cacheability'] = 'public';
        }
        return $theme->setting_file_serve($filearea, $args, $forcedownload, $options);
    } else {
        send_file_not_found();
    }
}

/**
 * Get the current user preferences that are available
 *
 * @return array[]
 */
function theme_retani_studio_user_preferences(): array {
    return [
        'drawer-open-block' => [
            'type' => PARAM_BOOL,
            'null' => NULL_NOT_ALLOWED,
            'default' => false,
            'permissioncallback' => [core_user::class, 'is_current_user'],
        ],
        'drawer-open-index' => [
            'type' => PARAM_BOOL,
            'null' => NULL_NOT_ALLOWED,
            'default' => true,
            'permissioncallback' => [core_user::class, 'is_current_user'],
        ],
        \theme_retani_studio\output\left_bar::PREFERENCE => [
            'type' => PARAM_BOOL,
            'null' => NULL_NOT_ALLOWED,
            'default' => false,
            'permissioncallback' => [core_user::class, 'is_current_user'],
        ],
        \theme_retani_studio\output\left_bar::OUTLINE_PREFERENCE => [
            'type' => PARAM_BOOL,
            'null' => NULL_NOT_ALLOWED,
            'default' => true,
            'permissioncallback' => [core_user::class, 'is_current_user'],
        ],
        \theme_retani_studio\colour_mode::PREFERENCE => [
            'type' => PARAM_ALPHA,
            'null' => NULL_NOT_ALLOWED,
            'choices' => \theme_retani_studio\colour_mode::get_modes(),
            // core_user::clean_preference() coerces a write of anything which is not one of the choices to this, so it
            // matches the default the site setting carries: a bad write does not put somebody into the dark mode.
            'default' => \theme_retani_studio\colour_mode::LIGHT,
            'permissioncallback' => [core_user::class, 'is_current_user'],
        ],
    ];
}

/**
 * Returns the main SCSS content.
 *
 * @param theme_config $theme The theme config object.
 * @return string
 */
function theme_retani_studio_get_main_scss_content($theme) {
    global $CFG;

    $scss = '';
    $filename = !empty($theme->settings->preset) ? $theme->settings->preset : null;
    $fs = get_file_storage();

    $context = context_system::instance();
    if ($filename == 'default.scss') {
        $scss .= file_get_contents($CFG->dirroot . '/theme/retani_studio/scss/preset/default.scss');
    } else if ($filename == 'plain.scss') {
        $scss .= file_get_contents($CFG->dirroot . '/theme/retani_studio/scss/preset/plain.scss');
    } else if ($filename == 'preset-retani.scss') {
        $scss .= file_get_contents($CFG->dirroot . '/theme/retani_studio/scss/preset/preset-retani.scss');
    }
    else if ($filename && ($presetfile = $fs->get_file($context->id, 'theme_retani_studio', 'preset', 0, '/', $filename))) {
        $scss .= $presetfile->get_content();
    }

    else {
        // Safety fallback - maybe new installs etc.
        $scss .= file_get_contents($CFG->dirroot . '/theme/retani_studio/scss/preset/default.scss');
    }

    return $scss;
}

/**
 * Get compiled css.
 *
 * @return string compiled css
 */
function theme_retani_studio_get_precompiled_css() {
    global $CFG;
    return file_get_contents($CFG->dirroot . '/theme/retani_studio/style/moodle.css');
}

/**
 * Get SCSS to prepend.
 *
 * @param theme_config $theme The theme config object.
 * @return string
 */
function theme_retani_studio_get_pre_scss($theme) {
    global $CFG;

    $scss = '';
    $configurable = [
        // Config key => [variableName, ...].
        'brandcolor' => ['primary'],
    ];

    // Prepend variables first.
    foreach ($configurable as $configkey => $targets) {
        $value = isset($theme->settings->{$configkey}) ? $theme->settings->{$configkey} : null;
        if (empty($value)) {
            continue;
        }
        array_map(function($target) use (&$scss, $value) {
            $scss .= '$' . $target . ': ' . $value . ";\n";
        }, (array) $targets);
    }

    // Add a new variable to indicate that we are running behat.
    if (defined('BEHAT_SITE_RUNNING')) {
        $scss .= "\$behatsite: true;\n";
    }

    // Prepend pre-scss.
    if (!empty($theme->settings->scsspre)) {
        $scss .= $theme->settings->scsspre;
    }

    // Also read from the pre.scss file in the theme's scss folder.
    $prescssfile = $CFG->dirroot . '/theme/retani_studio/scss/pre.scss';
    if (file_exists($prescssfile)) {
        $scss .= file_get_contents($prescssfile);
    }

    return $scss;
}
