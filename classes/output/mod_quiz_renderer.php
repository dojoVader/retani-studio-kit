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

use html_writer;
use mod_quiz\output\navigation_panel_base;
use mod_quiz\output\navigation_question_button;

/**
 * Quiz renderer for Retani: the quiz navigation block (mod_quiz_navblock) from mockup/Retani Quiz.dc.html.
 *
 * The question buttons keep the core markup (ids, classes and data attributes), which the quiz JavaScript relies on
 * for page switching and flag updates; only the panel around them changes: an answered (or correct) count next to
 * the block title, a grid of buttons, a legend and the actions at the bottom. The look is in scss/retani_quiz.scss.
 *
 * @package    theme_retani_studio
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_quiz_renderer extends \mod_quiz\output\renderer {
    /** @var string[] Button states that mean the question has a response. */
    protected const ANSWERED_STATES = ['answersaved', 'complete', 'requiresgrading', 'correct', 'partiallycorrect',
        'incorrect'];

    /** @var string[] Button states only shown when the review shows whether answers are correct. */
    protected const CORRECTNESS_STATES = ['correct', 'partiallycorrect', 'incorrect'];

    /**
     * Outputs the navigation block panel.
     *
     * @param navigation_panel_base $panel
     * @return string HTML fragment.
     */
    public function navigation_panel(navigation_panel_base $panel) {
        $buttons = $panel->get_question_buttons();

        // Count the real questions (not description items) and their states, for the count and the legend.
        $total = $answered = $correct = 0;
        $states = [];
        foreach ($buttons as $button) {
            if (!$button instanceof navigation_question_button || !$button->isrealquestion) {
                continue;
            }
            $total++;
            $states[$button->stateclass] = true;
            if (in_array($button->stateclass, self::ANSWERED_STATES)) {
                $answered++;
            }
            if ($button->stateclass === 'correct') {
                $correct++;
            }
        }
        $showcorrectness = (bool) array_intersect(self::CORRECTNESS_STATES, array_keys($states));

        $output = '';
        if ($total) {
            $a = (object) ['count' => $showcorrectness ? $correct : $answered, 'total' => $total];
            $meta = get_string($showcorrectness ? 'quiznav:correctcount' : 'quiznav:answeredcount',
                'theme_retani_studio', $a);
            $output .= html_writer::div($meta, 'retani-quiznav-meta');
        }

        $userpicture = $panel->user_picture();
        if ($userpicture) {
            $fullname = fullname($userpicture->user);
            if ($userpicture->size) {
                $fullname = html_writer::div($fullname);
            }
            $output .= html_writer::tag('div', $this->render($userpicture) . $fullname,
                ['id' => 'user-picture', 'class' => 'clearfix']);
        }
        $output .= $panel->render_before_button_bits($this);

        $bcc = $panel->get_button_container_class();
        $output .= html_writer::start_tag('div', ['class' => "qn_buttons retani-quiznav-grid $bcc"]);
        foreach ($buttons as $button) {
            $output .= $this->render($button);
        }
        $output .= html_writer::end_tag('div');

        if ($total) {
            $output .= $this->navigation_legend($showcorrectness, isset($states['partiallycorrect']));
        }

        $endbits = $panel->render_end_bits($this);
        if (trim($endbits) !== '') {
            $output .= html_writer::tag('div', $endbits, ['class' => 'othernav retani-quiznav-actions']);
        }

        $this->page->requires->js_init_call('M.mod_quiz.nav.init', null, false, quiz_get_js_module());

        return $output;
    }

    /**
     * The key to the button colours.
     *
     * @param bool $showcorrectness Whether the buttons show correct and incorrect answers (review) or just whether
     *      questions are answered.
     * @param bool $haspartial Whether any question is partially correct.
     * @return string HTML fragment.
     */
    protected function navigation_legend(bool $showcorrectness, bool $haspartial): string {
        if ($showcorrectness) {
            $items = ['correct' => get_string('correct', 'question'), 'incorrect' => get_string('incorrect', 'question')];
            if ($haspartial) {
                $items['partiallycorrect'] = get_string('partiallycorrect', 'question');
            }
            $items['notanswered'] = get_string('notanswered', 'question');
        } else {
            $items = [
                'answered' => get_string('answered', 'quiz'),
                'notyetanswered' => get_string('notanswered', 'question'),
                'flagged' => get_string('flagged', 'question'),
            ];
        }

        $html = '';
        foreach ($items as $state => $label) {
            $swatch = html_writer::span('', "retani-quiznav-swatch is-$state", ['aria-hidden' => 'true']);
            $html .= html_writer::tag('li', $swatch . $label, ['class' => 'retani-quiznav-legenditem']);
        }
        return html_writer::tag('ul', $html, ['class' => 'retani-quiznav-legend']);
    }
}
