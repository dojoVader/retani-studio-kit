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
use moodle_url;
use html_writer;
use get_string;
use theme_retani_studio\colour_mode;

defined('MOODLE_INTERNAL') || die;

/**
 * Renderers to align Moodle's HTML with that expected by Bootstrap
 *
 * @package    theme_retani_studio
 * @copyright  2012 Bas Brands, www.basbrands.nl
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class core_renderer extends \core_renderer {
    /** @var \admin_settingpage|null The settings page shown by /admin/settings.php, once looked up. */
    protected ?\admin_settingpage $adminsettingspage = null;

    /** @var bool Whether the admin settings page has been looked up. */
    protected bool $adminsettingspageloaded = false;
    /**
     * Returns the navbar search box using the inline field design.
     *
     * The field is always visible on md+ viewports and collapses behind a
     * toggle button on smaller screens.
     *
     * @param string $id Unused, kept for compatibility with the parent signature.
     * @return string HTML for the navbar search form, or empty string.
     */
    public function search_box($id = false) {
        global $CFG;

        if (empty($CFG->enableglobalsearch) || !has_capability('moodle/search:query', context_system::instance())) {
            return '';
        }

        $data = [
            'action' => new moodle_url('/search/index.php'),
            'hiddenfields' => (object) ['name' => 'context', 'value' => $this->page->context->id],
            'inputname' => 'q',
            'searchstring' => get_string('search'),
            'grouplabel' => get_string('sitewidesearch', 'search'),
        ];

        return $this->render_from_template('core/search_input_navbar_inline', $data);
    }

    /**
     * Returns the navbar menu for switching between the light and dark colour modes.
     *
     * @return string HTML for the colour mode menu, or an empty string.
     */
    public function colour_mode_menu(): string {
        return colour_mode::render_menu($this);
    }

    /**
     * Returns HTML to display a "Turn editing on/off" button in a form.
     *
     * @param moodle_url $url The URL + params to send through when clicking the button
     * @param string $method
     * @return string HTML the button
     */
    public function edit_button(moodle_url $url, string $method = 'post') {
        if ($this->page->theme->haseditswitch) {
            return;
        }
        $url->param('sesskey', sesskey());
        if ($this->page->user_is_editing()) {
            $url->param('edit', 'off');
            $editstring = get_string('turneditingoff');
        } else {
            $url->param('edit', 'on');
            $editstring = get_string('turneditingon');
        }
        $button = new \single_button($url, $editstring, $method, \single_button::BUTTON_PRIMARY);
        return $this->render_single_button($button);
    }

    /**
     * Renders the "breadcrumb" for all pages in boost.
     *
     * @return string the HTML for the navbar.
     */
    public function navbar(): string {
        $newnav = new \theme_retani_studio\boostnavbar($this->page);
        return $this->render_from_template('core/navbar', $newnav);
    }

    /**
     * Renders the context header for the page.
     *
     * @param array $headerinfo Heading information.
     * @param int $headinglevel What 'h' level to make the heading.
     * @return string A rendered context header.
     */
    public function context_header($headerinfo = null, $headinglevel = 1): string {
        global $DB, $USER, $CFG;
        require_once($CFG->dirroot . '/user/lib.php');
        $context = $this->page->context;
        $heading = null;
        $imagedata = null;
        $userbuttons = null;

        // Make sure to use the heading if it has been set.
        if (isset($headerinfo['heading'])) {
            $heading = $headerinfo['heading'];
        } else {
            $heading = $this->page->heading;
        }

        // The user context currently has images and buttons. Other contexts may follow.
        if ((isset($headerinfo['user']) || $context->contextlevel == CONTEXT_USER) && $this->page->pagetype !== 'my-index') {
            if (isset($headerinfo['user'])) {
                $user = $headerinfo['user'];
            } else {
                // Look up the user information if it is not supplied.
                $user = $DB->get_record('user', array('id' => $context->instanceid));
            }

            // If the user context is set, then use that for capability checks.
            if (isset($headerinfo['usercontext'])) {
                $context = $headerinfo['usercontext'];
            }

            // Only provide user information if the user is the current user, or a user which the current user can view.
            // When checking \core\user::can_view_profile(), either:
            // If the page context is course, check the course context (from the page object) or;
            // If page context is NOT course, then check across all courses.
            $course = ($this->page->context->contextlevel == CONTEXT_COURSE) ? $this->page->course : null;

            if (\core\user::can_view_profile($user, $course)) {
                // Use the user's full name if the heading isn't set.
                if (empty($heading)) {
                    $heading = fullname($user);
                }

                $imagedata = $this->user_picture($user, array('size' => 100));

                // Check to see if we should be displaying a message button.
                if (!empty($CFG->messaging) && has_capability('moodle/site:sendmessage', $context)) {
                    $userbuttons = array(
                        'messages' => array(
                            'buttontype' => 'message',
                            'title' => get_string('message', 'message'),
                            'url' => new moodle_url('/message/index.php', array('id' => $user->id)),
                            'image' => 't/message',
                            'linkattributes' => \core_message\helper::messageuser_link_params($user->id),
                            'page' => $this->page
                        )
                    );

                    if ($USER->id != $user->id) {
                        $cancreatecontact = \core_message\api::can_create_contact($USER->id, $user->id);
                        $iscontact = \core_message\api::is_contact($USER->id, $user->id);
                        $isrequested = \core_message\api::get_contact_requests_between_users($USER->id, $user->id);
                        $contacturlaction = '';
                        $linkattributes = \core_message\helper::togglecontact_link_params(
                            $user,
                            $iscontact,
                            true,
                            !empty($isrequested),
                        );
                        // If the user is not a contact.
                        if (!$iscontact) {
                            if ($isrequested) {
                                // Set it to true if a request has been sent.
                                $cancreatecontact = true;

                                // We just need the first request.
                                $requests = array_shift($isrequested);
                                if ($requests->userid == $USER->id) {
                                    // If the user has requested to be a contact.
                                    $contacttitle = 'contactrequestsent';
                                } else {
                                    // If the user has been requested to be a contact.
                                    $contacttitle = 'waitingforcontactaccept';
                                }
                                $linkattributes = array_merge($linkattributes, [
                                    'class' => 'disabled border-0',
                                    'tabindex' => '-1',
                                ]);
                            } else {
                                // If the user is not a contact and has not requested to be a contact.
                                $contacttitle = 'addtoyourcontacts';
                                $contacturlaction = 'addcontact';
                            }
                            $contactimage = 't/addcontact';
                        } else {
                            // If the user is a contact.
                            $contacttitle = 'removefromyourcontacts';
                            $contacturlaction = 'removecontact';
                            $contactimage = 't/removecontact';
                        }
                        if ($cancreatecontact) {
                            $userbuttons['togglecontact'] = array(
                                'buttontype' => 'togglecontact',
                                'title' => get_string($contacttitle, 'message'),
                                'url' => new moodle_url('/message/index.php', array(
                                        'user1' => $USER->id,
                                        'user2' => $user->id,
                                        $contacturlaction => $user->id,
                                        'sesskey' => sesskey())
                                ),
                                'image' => $contactimage,
                                'linkattributes' => $linkattributes,
                                'page' => $this->page
                            );
                        }
                    }

                    $this->page->requires->string_for_js('changesmadereallygoaway', 'moodle');
                }
            } else {
                $heading = null;
            }
        }

        $prefix = null;
        if ($context->contextlevel == CONTEXT_MODULE) {
            if ($this->page->course->format === 'singleactivity') {
                $heading = format_string($this->page->course->fullname, true, ['context' => $context]);
            } else {
                $heading = $this->page->cm->get_formatted_name();
                $iconurl = $this->page->cm->get_icon_url();
                $iconclass = $iconurl->get_param('filtericon') ? '' : 'nofilter';
                $iconattrs = [
                    'class' => "icon activityicon $iconclass",
                    'aria-hidden' => 'true'
                ];
                $imagedata = html_writer::img($iconurl->out(false), '', $iconattrs);
                $purposeclass = plugin_supports('mod', $this->page->activityname, FEATURE_MOD_PURPOSE);
                $purposeclass .= ' activityiconcontainer me-2';
                $purposeclass .= ' modicon_' . $this->page->activityname;
                $isbranded = component_callback('mod_' . $this->page->activityname, 'is_branded', [], false);
                $imagedata = html_writer::tag('div', $imagedata, ['class' => $purposeclass . ($isbranded ? ' isbranded' : '')]);
                if (!empty($USER->editing)) {
                    $prefix = get_string('modulename', $this->page->activityname);
                }
            }
        }

        $contextheader = new \context_header($heading, $headinglevel, $imagedata, $userbuttons, $prefix);
        return $this->render($contextheader);
    }

    /**
     * Renders the page header (core/full_header).
     *
     * On top of the core header data this adds:
     * - "coursehero": the course card (tags, name, contact, counts and progress) on course-level pages;
     * - "secondarynav": the secondary navigation, drawn as the tab bar under the header.
     *
     * @return string
     */
    public function full_header() {
        $pagetype = $this->page->pagetype;
        $homepage = get_home_page();
        $homepagetype = null;
        // Add a special case since /my/courses is a part of the /my subsystem.
        if ($homepage == HOMEPAGE_MY || $homepage == HOMEPAGE_MYCOURSES) {
            $homepagetype = 'my-index';
        } else if ($homepage == HOMEPAGE_SITE) {
            $homepagetype = 'site-index';
        }
        if (
            $this->page->include_region_main_settings_in_header_actions() &&
                !$this->page->blocks->is_block_present('settings')
        ) {
            // Only include the region main settings if the page has requested it and it doesn't already have
            // the settings block on it. The region main settings are included in the settings block and
            // duplicating the content causes behat failures.
            $this->page->add_header_action(html_writer::div(
                $this->region_main_settings_menu(),
                'd-print-none',
                ['id' => 'region-main-settings-menu']
            ));
        }

        $header = new \stdClass();
        $header->settingsmenu = $this->context_header_settings_menu();
        $header->hasnavbar = empty($this->page->layout_options['nonavbar']);
        $header->navbar = $this->navbar();
        $header->pageheadingbutton = $this->page_heading_button();
        $header->courseheader = $this->course_header();
        $header->headeractions = $this->page->get_header_actions();
        $header->headerextras = $this->page->get_header_extras();
        if (!empty($pagetype) && !empty($homepagetype) && $pagetype == $homepagetype) {
            $header->welcomemessage = \core_user::welcome_message();
        }

        $course = $this->page->course;
        $iscoursepage = $course && $course->id != SITEID && $this->page->context->contextlevel == CONTEXT_COURSE;
        $adminpage = $this->admin_settings_page();
        if ($iscoursepage) {
            // The hero renders the page h1 itself, so the context header is not needed.
            $header->coursehero = (new course_header($course))->export_for_template($this);
        } else if ($adminpage) {
            // Admin settings pages show the page name as the h1, under its category path.
            $header->adminheader = $this->admin_settings_header($adminpage);
        } else if ($admincategory = $this->admin_category_page()) {
            // Admin category pages (/admin/category.php) too; the page's own "Category: ..." h2 is hidden in CSS.
            $header->adminheader = $this->admin_settings_header($admincategory);
        } else if ($this->is_admin_index_page()) {
            // The site administration index shows the selected tab as the h1; theme_retani_studio/adminindex
            // swaps the title and description when another tab is picked.
            $header->adminheader = [
                'path' => [get_string('administrationsite')],
                'haspath' => true,
                'title' => get_string('general'),
                'description' => $this->admin_tab_description('root'),
                'isindex' => true,
            ];
        } else {
            $header->contextheader = $this->context_header();
        }
        $header->secondarynav = $this->secondary_navigation();

        return $this->render_from_template('core/full_header', $header);
    }

    /**
     * Renders a template, adding the Retani card layout data to the admin settings form.
     *
     * @param string $templatename
     * @param array|\stdClass $context
     * @return string
     */
    public function render_from_template($templatename, $context) {
        if ($templatename === 'core_admin/settings' && ($adminpage = $this->admin_settings_page())) {
            $context = (array) $context;
            $context['sections'] = $this->admin_settings_sections($adminpage, (string) ($context['settings'] ?? ''));
            $context['hassections'] = !empty($context['sections']);
            // The page name is already the h1 of the page header.
            $context['title'] = null;
        } else if ($templatename === 'core/settings_link_page' && $this->is_admin_index_page()) {
            $context = (array) $context;
            $node = $context['node'] ?? null;
            if ($node instanceof \navigation_node && $node->key === 'root') {
                $context['tabs'] = $this->admin_index_tabs($node);
                $context['hastabs'] = true;
            }
        }
        return parent::render_from_template($templatename, $context);
    }

    /**
     * Whether this is the site administration index: /admin/search.php without a search query.
     *
     * @return bool
     */
    protected function is_admin_index_page(): bool {
        if (!$this->page->has_set_url()) {
            return false;
        }
        return $this->page->url->compare(new moodle_url('/admin/search.php'), URL_MATCH_BASE)
            && trim((string) optional_param('query', '', PARAM_RAW)) === '';
    }

    /**
     * The theme's description of a site administration tab, if it has one.
     *
     * @param string $key The admin category name, or 'root' for the General tab.
     * @return string|null
     */
    protected function admin_tab_description(string $key): ?string {
        $stringid = 'admintabdesc_' . $key;
        if (!get_string_manager()->string_exists($stringid, 'theme_retani_studio')) {
            return null;
        }
        return get_string($stringid, 'theme_retani_studio');
    }

    /**
     * The site administration tree as tab panes of grouped links, for core/settings_link_page.
     *
     * Pane ids match the secondary navigation tabs (#link<key>), so its tab switching keeps working.
     * The General pane holds the root's own pages and its small categories; every other category with
     * children gets a pane of its own pages, then one group per sub-category.
     *
     * @param \navigation_node $root The 'root' node of the site administration navigation.
     * @return array
     */
    protected function admin_index_tabs(\navigation_node $root): array {
        $generaltitle = get_string('general');
        $general = $this->admin_index_tab($root->key, $generaltitle, 'root', true);
        $general['groups'] = $this->admin_index_groups($root, $generaltitle, true);

        $tabs = [$general];
        foreach ($root->children as $child) {
            if (!$child->display || !$child->has_children() || $child->is_short_branch()) {
                continue;
            }
            $title = (string) $child->text;
            $tab = $this->admin_index_tab($child->key, $title, $child->key, false);
            $tab['groups'] = $this->admin_index_groups($child, $title, false);
            $tabs[] = $tab;
        }
        return $tabs;
    }

    /**
     * Base data for one tab pane of the site administration index.
     *
     * @param string $key Node key, used for the pane id.
     * @param string $title Tab name, shown as the page h1 while the tab is selected.
     * @param string $desckey Key for {@see admin_tab_description()}.
     * @param bool $active Whether this pane is shown first.
     * @return array
     */
    protected function admin_index_tab(string $key, string $title, string $desckey, bool $active): array {
        return [
            'key' => $key,
            'title' => $title,
            'description' => $this->admin_tab_description($desckey),
            'active' => $active,
            'groups' => [],
        ];
    }

    /**
     * The groups of links in one tab pane.
     *
     * The node's own pages come first, under the tab name. Each sub-category then becomes a group; on the
     * General pane only the small categories do, as the larger ones have tabs of their own.
     *
     * @param \navigation_node $node
     * @param string $title Title of the first group.
     * @param bool $shortbranchesonly Whether to only include small sub-categories.
     * @return array
     */
    protected function admin_index_groups(\navigation_node $node, string $title, bool $shortbranchesonly): array {
        $pages = [];
        $categories = [];
        foreach ($node->children as $child) {
            if (!$child->display) {
                continue;
            }
            if (!$child->has_children()) {
                $pages[] = $child;
            } else if (!$shortbranchesonly || $child->is_short_branch()) {
                $categories[] = $child;
            }
        }

        $groups = [$this->admin_index_group($title, null, $pages)];
        foreach ($categories as $category) {
            $groups[] = $this->admin_index_group((string) $category->text, $category->action, $category->children);
        }
        return array_values(array_filter($groups, fn($group) => $group['count'] > 0));
    }

    /**
     * One group of links: a title with a page count, and every page below it, nested ones included.
     *
     * @param string $title
     * @param mixed $url Link for the title, if any.
     * @param iterable $nodes
     * @return array
     */
    protected function admin_index_group(string $title, $url, iterable $nodes): array {
        $settingsurl = new moodle_url('/admin/settings.php');
        $links = [];
        $collect = function(iterable $nodes) use (&$collect, &$links, $settingsurl) {
            foreach ($nodes as $node) {
                if (!$node->display) {
                    continue;
                }
                if ($node->has_children()) {
                    $collect($node->children);
                } else if ($node->action instanceof moodle_url || (is_string($node->action) && $node->action !== '')) {
                    $action = $node->action instanceof moodle_url ? $node->action : new moodle_url($node->action);
                    $links[] = [
                        'text' => (string) $node->text,
                        'url' => $action->out(false),
                        // Settings forms get a dot and a chevron; other admin tools an arrow.
                        'issettings' => $action->compare($settingsurl, URL_MATCH_BASE),
                    ];
                }
            }
        };
        $collect($nodes);

        $count = count($links);
        return [
            'title' => $title,
            'url' => $url instanceof moodle_url ? $url->out(false) : null,
            'links' => $links,
            'count' => $count,
            'countlabel' => $count === 1
                ? get_string('adminindex:countone', 'theme_retani_studio')
                : get_string('adminindex:count', 'theme_retani_studio', $count),
        ];
    }

    /**
     * The settings page shown by /admin/settings.php, if this is that page.
     *
     * @return \admin_settingpage|null
     */
    protected function admin_settings_page(): ?\admin_settingpage {
        global $CFG, $SITE;

        if ($this->adminsettingspageloaded) {
            return $this->adminsettingspage;
        }
        $this->adminsettingspageloaded = true;

        // Before the site is set up, settings.php shows its own install intro and title.
        if (empty($SITE->fullname) || !$this->page->has_set_url()) {
            return null;
        }
        if (!$this->page->url->compare(new moodle_url('/admin/settings.php'), URL_MATCH_BASE)) {
            return null;
        }
        $section = $this->page->url->get_param('section');
        if (empty($section)) {
            return null;
        }

        require_once($CFG->libdir . '/adminlib.php');
        $adminpage = admin_get_root()->locate($section, true);
        if (!($adminpage instanceof \admin_settingpage) || !$adminpage->check_access()) {
            return null;
        }
        $this->adminsettingspage = $adminpage;
        return $adminpage;
    }

    /**
     * The admin category shown by /admin/category.php, if this is that page.
     *
     * @return \core_admin\setting\tree\category|null
     */
    protected function admin_category_page(): ?\core_admin\setting\tree\category {
        global $CFG, $SITE;

        if (empty($SITE->fullname) || !$this->page->has_set_url()) {
            return null;
        }
        if (!$this->page->url->compare(new moodle_url('/admin/category.php'), URL_MATCH_BASE)) {
            return null;
        }
        $name = $this->page->url->get_param('category');
        if (empty($name)) {
            return null;
        }

        require_once($CFG->libdir . '/adminlib.php');
        $category = admin_get_root()->locate($name, true);
        if (!($category instanceof \core_admin\setting\tree\category) || !$category->check_access()) {
            return null;
        }
        return $category;
    }

    /**
     * Header data for an admin settings page or category: category path, name and optional description.
     *
     * @param \admin_settingpage|\core_admin\setting\tree\category $adminpage
     * @return array
     */
    protected function admin_settings_header(\admin_settingpage|\core_admin\setting\tree\category $adminpage): array {
        // The visible path runs from the page up to the admin root: drop both ends and read it top-down.
        // Each locate() of a node adds to its path again (category.php and this renderer both look the
        // category up), so repeated names are dropped first.
        $visiblepath = array_values(array_unique(array_map('strval', $adminpage->visiblepath)));
        $path = array_reverse(array_slice($visiblepath, 1, -1));
        if (empty($path)) {
            // Top-level categories sit directly under the site administration.
            $path = [get_string('administrationsite')];
        }

        $description = null;
        $stringid = 'adminpagedesc_' . $adminpage->name;
        if (get_string_manager()->string_exists($stringid, 'theme_retani_studio')) {
            $description = get_string($stringid, 'theme_retani_studio');
        }

        return [
            'path' => $path,
            'haspath' => !empty($path),
            'title' => (string) $adminpage->visiblename,
            'description' => $description,
        ];
    }

    /**
     * Split a settings page into cards, one per heading setting.
     *
     * Settings before the first heading go in a card named after the page's category.
     *
     * The settings are not rendered again here: admin/settings.php has already rendered them (and
     * settings such as the file manager queue their JavaScript as they render, so a second rendering
     * would start scripts for markup that is never shown). Instead the rendered HTML is split at the
     * markers that core_admin/setting_heading (theme override) puts around each heading.
     *
     * @param \admin_settingpage $adminpage
     * @param string $settingshtml The page's settings HTML, as rendered by admin_settingpage::output_html().
     * @return array List of sections, or empty to show the settings HTML as it is.
     */
    protected function admin_settings_sections(\admin_settingpage $adminpage, string $settingshtml): array {
        // Subclasses (such as the tabbed theme settings pages) lay out their own settings.
        if (get_class($adminpage) !== (new \ReflectionClass(\admin_settingpage::class))->getName()) {
            return [];
        }

        // Drop the wrapper added by admin_settingpage::output_html(); each card has its own fieldset.
        $html = preg_replace('~^\s*<fieldset>\s*<div class="clearer"><!-- --></div>~', '', $settingshtml, 1);
        $html = preg_replace('~</fieldset>\s*$~', '', $html, 1);

        // Chunk 0 holds the settings before the first heading; chunk n the settings after heading n.
        $chunks = preg_split('~<!-- retani-setting-heading -->.*?<!-- /retani-setting-heading -->~s', $html);

        $defaulttitle = (string) ($adminpage->visiblepath[1] ?? $adminpage->visiblename);
        $sections = [];
        $current = null;
        $chunk = 0;

        foreach ($adminpage->settings as $setting) {
            if ($setting instanceof \admin_setting_heading) {
                if ($current) {
                    $sections[] = $current;
                }
                $chunk++;
                $title = (string) $setting->visiblename;
                $current = [
                    'title' => $title !== '' ? $title : (string) $adminpage->visiblename,
                    'description' => $setting->description !== '' ? markdown_to_html($setting->description) : null,
                    'chunk' => $chunk,
                    'count' => 0,
                ];
                continue;
            }
            $current ??= ['title' => $defaulttitle, 'description' => null, 'chunk' => 0, 'count' => 0];
            $current['count']++;
        }
        if ($current) {
            $sections[] = $current;
        }

        // A heading that does not use the heading template leaves the markers out of step with the
        // headings: show the settings as they are rather than in the wrong cards.
        if (count($chunks) !== $chunk + 1) {
            return [];
        }

        foreach ($sections as $index => &$section) {
            $section['html'] = $chunks[$section['chunk']];
            unset($section['chunk']);
            $section['id'] = 'retani-settings-section-' . $index;
            $section['countlabel'] = $section['count'] === 1
                ? get_string('adminsettings:countone', 'theme_retani_studio')
                : get_string('adminsettings:count', 'theme_retani_studio', $section['count']);
            $section['hascount'] = $section['count'] > 0;
        }
        return $sections;
    }

    /**
     * Export the secondary navigation for the tab bar in core/full_header.
     *
     * @return array|null Context for core/secondarymoremenu, or null when the page has none.
     */
    protected function secondary_navigation(): ?array {
        if (!$this->page->has_secondary_navigation()) {
            return null;
        }
        $tablistnav = $this->page->has_tablist_secondary_navigation();
        $moremenu = new \core\navigation\output\more_menu($this->page->secondarynav, 'nav-tabs', true, $tablistnav);
        return $moremenu->export_for_template($this);
    }

    /**
     * See if this is the first view of the current cm in the session if it has fake blocks.
     *
     * (We track up to 100 cms so as not to overflow the session.)
     * This is done for drawer regions containing fake blocks so we can show blocks automatically.
     *
     * @return boolean true if the page has fakeblocks and this is the first visit.
     */
    public function firstview_fakeblocks(): bool {
        global $SESSION;

        $firstview = false;
        if ($this->page->cm) {
            if (!$this->page->blocks->region_has_fakeblocks('side-pre')) {
                return false;
            }
            if (!property_exists($SESSION, 'firstview_fakeblocks')) {
                $SESSION->firstview_fakeblocks = [];
            }
            if (array_key_exists($this->page->cm->id, $SESSION->firstview_fakeblocks)) {
                $firstview = false;
            } else {
                $SESSION->firstview_fakeblocks[$this->page->cm->id] = true;
                $firstview = true;
                if (count($SESSION->firstview_fakeblocks) > 100) {
                    array_shift($SESSION->firstview_fakeblocks);
                }
            }
        }
        return $firstview;
    }
}
