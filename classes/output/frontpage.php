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

use context_course;
use context_system;
use core_course_category;
use core_course_list_element;
use core\output\renderable;
use core\output\renderer_base;
use core\output\templatable;
use core\url;
use moodle_page;

/**
 * The landing page shown as the site home.
 *
 * The courses come from the Moodle course catalogue; every other piece of content comes from the theme's front page
 * settings (see settings/frontpage.php).
 *
 * @package   theme_retani_studio
 * @copyright 2026 Retani
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class frontpage implements renderable, templatable {

    /** @var string Prefix of the front page settings. */
    const PREFIX = 'fp_';

    /** @var string[] Line icons (SVG path data, 24px grid) which can be picked for the offers. */
    const ICONS = [
        'people' => 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M16 3a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5',
        'certificate' => 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14L7 22l5-3 5 3-1.5-8',
        'device' => 'M7 2h10v20H7zM11 18h2',
        'chart' => 'M4 19h16M6 15l3-4 3 2 5-7',
        'building' => 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6',
        'book' => 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5',
        'clock' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
        'globe' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
        'shield' => 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    ];

    /** @var string[] Icons drawn on the three plan cards. */
    const PLAN_ICONS = ['chart', 'building', 'people'];

    /** @var string[][] Avatar colours, as [solid, tint] pairs. */
    const AVATARS = [
        ['#0E7C5A', '#DFF3EA'],
        ['#1F4E9C', '#E3ECFA'],
        ['#B26A00', '#FBEFD9'],
        ['#9C2F5E', '#F8E3EC'],
        ['#6A3FB5', '#ECE4F8'],
        ['#0E6E8C', '#DFF0F5'],
    ];

    /** @var string[] Default palette: accent, hero background, footer background. */
    const PALETTE = ['#00704A', '#E2F1EA', '#0F2A1F'];

    /** @var int Most courses the courses section shows. */
    const MAX_COURSES = 12;

    /** @var context_system */
    protected context_system $context;

    /**
     * Constructor.
     *
     * @param moodle_page $page The page the front page is drawn on.
     */
    public function __construct(
        /** @var moodle_page The page the front page is drawn on. */
        protected moodle_page $page,
    ) {
        $this->context = context_system::instance();
    }

    /**
     * Whether the theme should draw the landing page in place of the standard site home.
     *
     * @param moodle_page $page
     * @return bool
     */
    public static function is_enabled(moodle_page $page): bool {
        return !empty($page->theme->settings->{self::PREFIX . 'enabled'});
    }

    #[\Override]
    public function export_for_template(renderer_base $output): array {
        global $CFG, $SITE;

        $sitename = format_string($SITE->fullname, true, ['context' => $this->context, 'escape' => false]);
        $copyright = $this->text('copyright');
        $copyright = $copyright !== '' ? str_replace(['{year}', '{sitename}'], [userdate(time(), '%Y'), $sitename], $copyright)
            : get_string('copyright', 'theme_retani_studio', ['year' => userdate(time(), '%Y'), 'sitename' => $sitename]);

        $brandname = $this->text('brandname');
        $brandaccent = $this->text('brandaccent');
        if ($brandname === '' && $brandaccent === '') {
            $brandname = $sitename;
        }

        $loggedin = isloggedin() && !isguestuser();

        return [
            'uniqid' => \html_writer::random_id('retani-fp-'),
            'style' => $this->palette_style(),
            'homeurl' => (new url('/'))->out(false),
            'logourl' => $this->page->theme->setting_file_url(self::PREFIX . 'logo', self::PREFIX . 'logo'),
            'brandname' => $brandname,
            'brandaccent' => $brandaccent,
            'sitename' => $sitename,
            'navlinks' => $this->links($this->setting('navlinks')),
            'isloggedin' => $loggedin,
            'loginurl' => get_login_url(),
            'loginlabel' => get_string(empty($CFG->registerauth) ? 'fp_login' : 'fp_loginregister', 'theme_retani_studio'),
            'dashboardurl' => (new url('/my/'))->out(false),
            'contact' => $this->button('contacttext', 'contacturl'),
            'hero' => $this->hero(),
            'offers' => $this->offers(),
            'courses' => $this->courses($output),
            'stats' => $this->stats(),
            'paths' => $this->paths(),
            'featured' => $this->featured(),
            'pricing' => $this->pricing(),
            'testimonials' => $this->testimonials(),
            'faq' => $this->faq(),
            'news' => $this->news(),
            'partners' => $this->partners(),
            'cta' => $this->cta(),
            'footer' => $this->footer(),
            'copyright' => $copyright,
        ];
    }

    /**
     * The hero section at the top of the page.
     *
     * @return array
     */
    protected function hero(): array {
        return [
            'title' => $this->text('herotitle'),
            'text' => $this->text('herotext'),
            'search' => !empty($this->setting('herosearch')),
            'searchurl' => (new url('/course/search.php'))->out(false),
            'placeholder' => $this->text('herosearchplaceholder'),
            'buttontext' => $this->text('herobuttontext') ?: get_string('search'),
            'imageurl' => $this->file_url('heroimage'),
        ];
    }

    /**
     * The "why train with us" section.
     *
     * @return array|false
     */
    protected function offers(): array|false {
        if (!$this->shown('offers')) {
            return false;
        }
        $items = [];
        for ($i = 1; $i <= 4; $i++) {
            $title = $this->text("offer{$i}title");
            if ($title === '') {
                continue;
            }
            $icon = $this->setting("offer{$i}icon");
            $items[] = [
                'title' => $title,
                'text' => $this->text("offer{$i}text"),
                'icon' => self::ICONS[$icon] ?? self::ICONS['certificate'],
            ];
        }
        if (!$items) {
            return false;
        }
        return ['title' => $this->text('offerstitle'), 'text' => $this->text('offerstext'), 'items' => $items];
    }

    /**
     * The courses section, filled from the Moodle course catalogue.
     *
     * @param renderer_base $output
     * @return array|false
     */
    protected function courses(renderer_base $output): array|false {
        if (!$this->shown('courses')) {
            return false;
        }

        $courses = $this->get_courses();
        $showprice = !empty($this->setting('coursesprice'));
        $prices = $showprice ? $this->get_prices(array_keys($courses)) : [];

        $items = [];
        $categories = [];
        $k = 0;
        foreach ($courses as $course) {
            $context = context_course::instance($course->id);
            $category = core_course_category::get($course->category, IGNORE_MISSING, true);
            $categoryname = $category ? $category->get_formatted_name() : '';
            if ($category && !isset($categories[$category->id])) {
                $categories[$category->id] = ['id' => $category->id, 'name' => $categoryname];
            }

            $summary = '';
            if (!empty($course->summary)) {
                $summary = format_text($course->summary, $course->summaryformat, ['context' => $context, 'noclean' => false]);
                $summary = shorten_text(trim(html_to_text($summary, 0, false)), 130);
            }

            $teacher = false;
            $contacts = $course->get_course_contacts();
            if ($contacts) {
                $contact = reset($contacts);
                $teacher = [
                    'name' => $contact['username'],
                    'role' => $contact['rolename'],
                    'initials' => self::initials($contact['username']),
                ];
            }

            $image = \core_course\external\course_summary_exporter::get_course_image($course);
            $avatar = self::AVATARS[$k % count(self::AVATARS)];
            $learners = count_enrolled_users($context, '', 0, true);

            $item = [
                'id' => $course->id,
                'url' => (new url('/course/view.php', ['id' => $course->id]))->out(false),
                'name' => format_string($course->fullname, true, ['context' => $context, 'escape' => false]),
                'summary' => $summary,
                'imageurl' => $image ?: $output->get_generated_image_for_id($course->id),
                'tint' => $avatar[1],
                'avatarcolour' => $avatar[0],
                'categoryid' => $category ? $category->id : 0,
                'category' => $categoryname,
                'teacher' => $teacher,
                'learners' => get_string($learners == 1 ? 'fp_learner' : 'fp_learners', 'theme_retani_studio',
                    number_format($learners)),
                'showprice' => $showprice,
                'price' => $prices[$course->id] ?? get_string('fp_free', 'theme_retani_studio'),
                'isfree' => !isset($prices[$course->id]),
            ];
            $items[] = $item;
            $k++;
        }

        $tabs = [];
        if (!empty($this->setting('coursestabs')) && count($categories) > 1) {
            $tabs[] = ['id' => 0, 'name' => get_string('all'), 'selected' => true];
            foreach ($categories as $cat) {
                $tabs[] = $cat + ['selected' => false];
            }
        }

        $buttons = array_values(array_filter([
            $this->button('coursesbutton1text', 'coursesbutton1url', true),
            $this->button('coursesbutton2text', 'coursesbutton2url'),
        ]));

        return [
            'title' => $this->text('coursestitle'),
            'items' => $items,
            'hasitems' => !empty($items),
            'tabs' => $tabs,
            'hastabs' => !empty($tabs),
            'buttons' => $buttons,
        ];
    }

    /**
     * Get the courses for the courses section, which the current user is allowed to see.
     *
     * @return core_course_list_element[] Indexed by course id.
     */
    protected function get_courses(): array {
        global $DB;

        $count = max(1, min(self::MAX_COURSES, (int) ($this->setting('coursescount') ?: 6)));

        if ($this->setting('coursessource') === 'ids') {
            $courses = [];
            $ids = array_unique(array_filter(array_map('intval', preg_split('/[\s,]+/', $this->setting('courseids')))));
            foreach ($ids as $id) {
                if ($id == SITEID || count($courses) >= $count) {
                    continue;
                }
                $course = $DB->get_record('course', ['id' => $id]);
                if (!$course) {
                    continue;
                }
                if (core_course_category::can_view_course_info($course)) {
                    $courses[$id] = new core_course_list_element($course);
                }
            }
            return $courses;
        }

        $category = null;
        if ($categoryid = (int) $this->setting('coursescategory')) {
            $category = core_course_category::get($categoryid, IGNORE_MISSING);
        }
        $category = $category ?? core_course_category::top();

        $sort = match ($this->setting('coursessort')) {
            'fullname' => ['fullname' => 1],
            'startdate' => ['startdate' => -1],
            'sortorder' => ['sortorder' => 1],
            default => ['id' => -1],
        };

        return $category->get_courses([
            'recursive' => true,
            'summary' => true,
            'coursecontacts' => true,
            'sort' => $sort,
            'limit' => $count,
        ]);
    }

    /**
     * Get the cheapest enrolment fee of each course which charges one.
     *
     * @param int[] $courseids
     * @return string[] Formatted prices, indexed by course id.
     */
    protected function get_prices(array $courseids): array {
        global $DB;

        $methods = array_filter(['fee', 'paypal'], 'enrol_is_enabled');
        if (!$courseids || !$methods) {
            return [];
        }
        [$coursesql, $params] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED);
        [$methodsql, $methodparams] = $DB->get_in_or_equal($methods, SQL_PARAMS_NAMED, 'm');
        $records = $DB->get_records_select(
            'enrol',
            "courseid $coursesql AND enrol $methodsql AND status = :status",
            $params + $methodparams + ['status' => ENROL_INSTANCE_ENABLED],
            'courseid, id',
            'id, courseid, cost, currency',
        );

        $cheapest = [];
        foreach ($records as $record) {
            $cost = (float) unformat_float($record->cost);
            if ($cost <= 0 || empty($record->currency)) {
                continue;
            }
            if (!isset($cheapest[$record->courseid]) || $cost < $cheapest[$record->courseid]->cost) {
                $cheapest[$record->courseid] = (object) ['cost' => $cost, 'currency' => $record->currency];
            }
        }

        $prices = [];
        foreach ($cheapest as $courseid => $fee) {
            $prices[$courseid] = \core_payment\helper::get_cost_as_string($fee->cost, $fee->currency);
        }
        return $prices;
    }

    /**
     * The band of numbers.
     *
     * @return array|false
     */
    protected function stats(): array|false {
        if (!$this->shown('stats')) {
            return false;
        }
        $items = [];
        foreach ($this->lines($this->setting('stats'), 2) as [$value, $label]) {
            $items[] = ['value' => $this->format($value), 'label' => $this->format($label)];
        }
        return $items ? ['items' => $items] : false;
    }

    /**
     * The learning paths section.
     *
     * @return array|false
     */
    protected function paths(): array|false {
        if (!$this->shown('paths')) {
            return false;
        }
        $buttontext = $this->text('pathsbuttontext');
        $items = [];
        foreach ($this->lines($this->setting('paths'), 4) as [$title, $label, $text, $link]) {
            $href = $this->url($link);
            $items[] = [
                'title' => $this->format($title),
                'label' => $this->format($label),
                'text' => $this->format($text),
                'url' => $href,
                'buttontext' => $href !== '' ? $buttontext : '',
            ];
        }
        return $items ? ['title' => $this->text('pathstitle'), 'items' => $items] : false;
    }

    /**
     * The featured programme section.
     *
     * @return array|false
     */
    protected function featured(): array|false {
        if (!$this->shown('featured')) {
            return false;
        }
        $points = [];
        foreach ($this->lines($this->setting('featuredpoints'), 1) as [$point]) {
            $points[] = $this->format($point);
        }
        return [
            'heading' => $this->text('featuredheading'),
            'title' => $this->text('featuredtitle'),
            'text' => $this->text('featuredtext'),
            'points' => $points,
            'imageurl' => $this->file_url('featuredimage'),
            'videourl' => $this->url($this->setting('featuredvideourl')),
            'button' => $this->button('featuredbuttontext', 'featuredbuttonurl', true),
            'pricelabel' => $this->text('featuredpricelabel'),
            'price' => $this->text('featuredprice'),
        ];
    }

    /**
     * The membership plans section.
     *
     * @return array|false
     */
    protected function pricing(): array|false {
        if (!$this->shown('pricing')) {
            return false;
        }
        $currency = $this->text('pricingcurrency');
        $discount = max(0, min(100, (float) $this->setting('pricingdiscount')));
        $featured = (int) ($this->setting('pricingfeatured') ?: 2);
        $buttontext = $this->text('pricingbuttontext');
        $free = get_string('fp_free', 'theme_retani_studio');

        $plans = [];
        for ($i = 1; $i <= 3; $i++) {
            $name = $this->text("plan{$i}name");
            if ($name === '') {
                continue;
            }
            $monthly = (float) $this->setting("plan{$i}price");
            $yearly = round($monthly * 12 * (100 - $discount) / 100);
            $colour = $this->colour("plan{$i}colour", '#2F80D1');

            $features = [];
            foreach ($this->lines($this->setting("plan{$i}features"), 1) as [$feature]) {
                $excluded = str_starts_with($feature, '-');
                $features[] = ['text' => $this->format(ltrim($feature, '- ')), 'excluded' => $excluded];
            }

            $plans[] = [
                'name' => $name,
                'colour' => $colour,
                'tint' => self::mix($colour, '#FFFFFF', 0.88),
                'icon' => self::ICONS[self::PLAN_ICONS[($i - 1) % 3]],
                'isfree' => $monthly <= 0,
                'monthly' => $monthly > 0 ? $currency . number_format($monthly) : $free,
                'yearly' => $monthly > 0 ? $currency . number_format($yearly) : $free,
                'features' => $features,
                'featured' => $i === $featured,
                'buttontext' => trim($buttontext . ' ' . $name),
                'url' => $this->url($this->setting("plan{$i}url")) ?: '#',
            ];
        }
        if (!$plans) {
            return false;
        }
        return [
            'title' => $this->text('pricingtitle'),
            'yearlylabel' => $this->text('pricingyearlylabel') ?: get_string('fp_yearly', 'theme_retani_studio'),
            'plans' => $plans,
        ];
    }

    /**
     * The testimonials band.
     *
     * @return array|false
     */
    protected function testimonials(): array|false {
        if (!$this->shown('testimonials')) {
            return false;
        }
        $items = [];
        for ($i = 1; $i <= 3; $i++) {
            $quote = $this->text("testimonial{$i}quote");
            $name = $this->text("testimonial{$i}name");
            if ($quote === '' || $name === '') {
                continue;
            }
            $items[] = [
                'index' => count($items),
                'quote' => $quote,
                'name' => $name,
                'role' => $this->text("testimonial{$i}role"),
                'initials' => self::initials($name),
                'colour' => self::AVATARS[(count($items) * 3) % count(self::AVATARS)][0],
                'active' => !$items,
            ];
        }
        return $items ? ['items' => $items, 'multiple' => count($items) > 1] : false;
    }

    /**
     * The frequently asked questions section.
     *
     * @return array|false
     */
    protected function faq(): array|false {
        if (!$this->shown('faq')) {
            return false;
        }
        $items = [];
        foreach ($this->lines($this->setting('faqs'), 2) as $i => [$question, $answer]) {
            $items[] = [
                'letter' => chr(65 + ($i % 26)),
                'question' => $this->format($question),
                'answer' => $this->format($answer),
                'open' => $i === 0,
            ];
        }
        return $items ? ['title' => $this->text('faqtitle'), 'items' => $items] : false;
    }

    /**
     * The news section.
     *
     * @return array|false
     */
    protected function news(): array|false {
        if (!$this->shown('news')) {
            return false;
        }
        $items = [];
        for ($i = 1; $i <= 3; $i++) {
            $title = $this->text("news{$i}title");
            if ($title === '') {
                continue;
            }
            $items[] = [
                'title' => $title,
                'date' => $this->text("news{$i}date"),
                'author' => $this->text("news{$i}author"),
                'summary' => $this->text("news{$i}summary"),
                'url' => $this->url($this->setting("news{$i}url")) ?: '#',
                'imageurl' => $this->file_url("news{$i}image"),
            ];
        }
        if (!$items) {
            return false;
        }
        return [
            'title' => $this->text('newstitle'),
            'items' => $items,
            'button' => $this->button('newsbuttontext', 'newsbuttonurl', true),
        ];
    }

    /**
     * The partner logos section.
     *
     * @return array|false
     */
    protected function partners(): array|false {
        if (!$this->shown('partners')) {
            return false;
        }
        $filearea = self::PREFIX . 'partnerlogos';
        $files = get_file_storage()->get_area_files($this->context->id, 'theme_retani_studio', $filearea, 0,
            'filename', false);
        $logos = [];
        foreach ($files as $file) {
            if (!$file->is_valid_image()) {
                continue;
            }
            $logos[] = [
                'url' => url::make_pluginfile_url($this->context->id, 'theme_retani_studio', $filearea,
                    theme_get_revision(), $file->get_filepath(), $file->get_filename())->out(false),
                'name' => pathinfo($file->get_filename(), PATHINFO_FILENAME),
            ];
        }
        return $logos ? ['title' => $this->text('partnerstitle'), 'logos' => $logos] : false;
    }

    /**
     * The call to action band above the footer.
     *
     * @return array|false
     */
    protected function cta(): array|false {
        if (!$this->shown('cta') || $this->text('ctatext') === '') {
            return false;
        }
        return ['text' => $this->text('ctatext'), 'button' => $this->button('ctabuttontext', 'ctabuttonurl', true)];
    }

    /**
     * The footer.
     *
     * @return array
     */
    protected function footer(): array {
        $columns = [];
        for ($i = 1; $i <= 2; $i++) {
            $links = $this->links($this->setting("footercol{$i}links"));
            $title = $this->text("footercol{$i}title");
            if ($links || $title !== '') {
                $columns[] = ['title' => $title, 'links' => $links];
            }
        }
        $subscribeurl = $this->url($this->setting('subscribeurl'));
        $subscribetitle = $this->text('subscribetitle');
        return [
            'columns' => $columns,
            'subscribe' => $subscribetitle !== '' || $subscribeurl !== '' ? [
                'title' => $subscribetitle,
                'text' => $this->text('subscribetext'),
                'url' => $subscribeurl,
                'buttontext' => $this->text('subscribebuttontext') ?: get_string('subscribe', 'forum'),
            ] : false,
        ];
    }

    /**
     * The CSS custom properties which carry the palette picked in the settings.
     *
     * @return string
     */
    protected function palette_style(): string {
        $accent = $this->colour('accentcolor', self::PALETTE[0]);
        $hero = $this->colour('herobgcolor', self::PALETTE[1]);
        $deep = $this->colour('footerbgcolor', self::PALETTE[2]);
        $vars = [
            '--fp-ac' => $accent,
            '--fp-ac-dark' => self::mix($accent, '#000000', 0.18),
            '--fp-ac-mid' => self::mix($accent, '#FFFFFF', 0.5),
            '--fp-ac-soft' => self::mix($accent, '#FFFFFF', 0.88),
            '--fp-ac-ring' => self::rgba($accent, 0.25),
            '--fp-hero' => $hero,
            '--fp-deep' => $deep,
        ];
        $style = '';
        foreach ($vars as $name => $value) {
            $style .= "{$name}: {$value}; ";
        }
        return trim($style);
    }

    /**
     * Get the raw value of a front page setting.
     *
     * @param string $name Setting name without the prefix.
     * @return string
     */
    protected function setting(string $name): string {
        return trim((string) ($this->page->theme->settings->{self::PREFIX . $name} ?? ''));
    }

    /**
     * Whether a section is switched on.
     *
     * @param string $section
     * @return bool
     */
    protected function shown(string $section): bool {
        return !empty($this->setting('show' . $section));
    }

    /**
     * Get a front page setting as text, run through the filters (so that multi-language content works).
     *
     * The result is not escaped: the templates escape it.
     *
     * @param string $name Setting name without the prefix.
     * @return string
     */
    protected function text(string $name): string {
        return $this->format($this->setting($name));
    }

    /**
     * Run text through format_string(), without escaping it.
     *
     * @param string $text
     * @return string
     */
    protected function format(string $text): string {
        return $text === '' ? '' : format_string($text, true, ['context' => $this->context, 'escape' => false]);
    }

    /**
     * Get a colour setting, falling back to a default when it is not a hex colour.
     *
     * @param string $name Setting name without the prefix.
     * @param string $default
     * @return string
     */
    protected function colour(string $name, string $default): string {
        $value = $this->setting($name);
        return preg_match('/^#([0-9a-f]{3}){1,2}$/i', $value) ? $value : $default;
    }

    /**
     * Get the URL of a file uploaded to a front page setting.
     *
     * @param string $name Setting name without the prefix.
     * @return string
     */
    protected function file_url(string $name): string {
        $url = $this->page->theme->setting_file_url(self::PREFIX . $name, self::PREFIX . $name);
        return $url ? (string) $url : '';
    }

    /**
     * Turn a link entered in the settings into one which can be used in an href.
     *
     * Anchors (#courses) are kept as they are, paths starting with / are relative to the site, and anything else
     * must be a full URL.
     *
     * @param string $link
     * @return string An empty string when the link is not usable.
     */
    protected function url(string $link): string {
        $link = trim($link);
        if ($link === '') {
            return '';
        }
        if (str_starts_with($link, '#')) {
            return '#' . clean_param(substr($link, 1), PARAM_ALPHANUMEXT);
        }
        if (str_starts_with($link, '/') && !str_starts_with($link, '//')) {
            return (new url($link))->out(false);
        }
        if (str_starts_with($link, 'mailto:')) {
            return clean_param(substr($link, 7), PARAM_EMAIL) ? $link : '';
        }
        return clean_param($link, PARAM_URL);
    }

    /**
     * Build a button from a text and a link setting.
     *
     * @param string $textname Setting holding the label.
     * @param string $urlname Setting holding the link.
     * @param bool $primary Whether it is drawn as the solid button.
     * @return array|null Nothing when either is empty.
     */
    protected function button(string $textname, string $urlname, bool $primary = false): ?array {
        $text = $this->text($textname);
        $href = $this->url($this->setting($urlname));
        if ($text === '' || $href === '') {
            return null;
        }
        return ['text' => $text, 'url' => $href, 'primary' => $primary];
    }

    /**
     * Parse a "Label|URL" list, one per line.
     *
     * @param string $value
     * @return array[]
     */
    protected function links(string $value): array {
        $links = [];
        foreach ($this->lines($value, 2) as [$label, $link]) {
            $links[] = ['label' => $this->format($label), 'url' => $this->url($link) ?: '#'];
        }
        return $links;
    }

    /**
     * Split a list setting into its lines, and each line into its |-separated parts.
     *
     * @param string $value
     * @param int $parts How many parts each line has; missing ones are empty strings.
     * @return array[]
     */
    protected function lines(string $value, int $parts): array {
        $lines = [];
        foreach (preg_split('/\R/', $value) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            $bits = array_map('trim', explode('|', $line, $parts));
            $lines[] = array_pad($bits, $parts, '');
        }
        return $lines;
    }

    /**
     * Get up to two initials from a name, leaving out titles such as Mr. or Dr.
     *
     * @param string $name
     * @return string
     */
    public static function initials(string $name): string {
        $name = preg_replace('/^((Mrs?|Ms|Dr|Prof|Engr|Barr)\.?\s+)+/i', '', trim($name));
        $initials = '';
        foreach (preg_split('/\s+/u', $name) as $word) {
            if ($word !== '') {
                $initials .= \core_text::strtoupper(\core_text::substr($word, 0, 1));
            }
        }
        return \core_text::substr($initials, 0, 2);
    }

    /**
     * Mix two hex colours.
     *
     * @param string $colour
     * @param string $with
     * @param float $amount How much of $with to mix in, from 0 to 1.
     * @return string
     */
    public static function mix(string $colour, string $with, float $amount): string {
        $a = self::rgb($colour);
        $b = self::rgb($with);
        $mixed = '';
        for ($i = 0; $i < 3; $i++) {
            $mixed .= sprintf('%02X', (int) round($a[$i] * (1 - $amount) + $b[$i] * $amount));
        }
        return '#' . $mixed;
    }

    /**
     * Get a hex colour as rgba() with an opacity.
     *
     * @param string $colour
     * @param float $alpha
     * @return string
     */
    protected static function rgba(string $colour, float $alpha): string {
        [$r, $g, $b] = self::rgb($colour);
        return "rgba({$r}, {$g}, {$b}, {$alpha})";
    }

    /**
     * Split a hex colour into its red, green and blue values.
     *
     * @param string $colour #RGB or #RRGGBB.
     * @return int[]
     */
    protected static function rgb(string $colour): array {
        $hex = ltrim($colour, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        return [hexdec(substr($hex, 0, 2)), hexdec(substr($hex, 2, 2)), hexdec(substr($hex, 4, 2))];
    }
}
