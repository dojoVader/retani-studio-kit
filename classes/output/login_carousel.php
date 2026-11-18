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

use context_system;
use renderer_base;
use theme_config;

/**
 * The image carousel on the left panel of the login page.
 *
 * Each slide has a title, text, image and image description, set in the "Login page" tab of the theme settings.
 * An empty title, text or description uses the default from the language file, and a slide without an uploaded
 * image uses the bundled one (pix/login/slideN.jpg).
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class login_carousel {
    /** @var int The number of slides that can be set up. */
    const MAX_SLIDES = 4;

    /** @var int Milliseconds each slide is shown for before the next one. */
    const INTERVAL = 6000;

    /**
     * Constructor.
     *
     * @param theme_config $theme The theme whose settings the slides come from.
     */
    public function __construct(
        /** @var theme_config The theme whose settings the slides come from. */
        protected theme_config $theme,
    ) {
    }

    /**
     * The slides to show, in order.
     *
     * @param renderer_base $output Used to find the bundled images.
     * @return array[] Each with title, body, image and alt.
     */
    public function slides(renderer_base $output): array {
        $settings = $this->theme->settings;
        $count = $settings->loginslides ?? self::MAX_SLIDES;
        $count = max(0, min(self::MAX_SLIDES, (int) $count));
        $context = context_system::instance();

        $slides = [];
        for ($i = 1; $i <= $count; $i++) {
            $text = function (string $part) use ($settings, $i, $context): string {
                $value = trim((string) ($settings->{"loginslide{$i}{$part}"} ?? ''));
                if ($value === '') {
                    return get_string("loginslide{$i}{$part}_default", 'theme_retani_studio');
                }
                return format_string($value, true, ['context' => $context, 'escape' => false]);
            };
            $image = $this->theme->setting_file_url("loginslide{$i}image", "loginslide{$i}image");
            $slides[] = [
                'title' => $text('title'),
                'body' => $text('body'),
                'image' => $image ? (string) $image : $output->image_url("login/slide{$i}", 'theme')->out(false),
                'alt' => $text('alt'),
            ];
        }
        return $slides;
    }

    /**
     * Context for the carousel in core/login_panel.
     *
     * @param renderer_base $output
     * @return array|false False when there are no slides to show.
     */
    public function export_for_template(renderer_base $output): array|false {
        $slides = $this->slides($output);
        if (!$slides) {
            return false;
        }
        $props = [
            'interval' => self::INTERVAL,
            'label' => get_string('carousellabel', 'theme_retani_studio'),
            'previouslabel' => get_string('carouselprevious', 'theme_retani_studio'),
            'nextlabel' => get_string('carouselnext', 'theme_retani_studio'),
            'slidelabel' => get_string('carouselslide', 'theme_retani_studio', '{$a}'),
            'slides' => $slides,
        ];
        return [
            'propsjson' => json_encode($props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG),
            'first' => $slides[0],
        ];
    }
}
