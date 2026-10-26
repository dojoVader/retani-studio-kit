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
 * Image carousel for the left panel of the login page.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/LoginCarousel"
 * by core/react_autoinit, from the {{#react}} helper in theme_retani_studio/core/login_panel.
 *
 * @module     theme_retani_studio/LoginCarousel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useEffect, useState} from 'react';

export interface LoginCarouselSlide {
    /** Headline shown above the image. */
    title: string;
    /** Supporting copy shown under the headline. */
    body: string;
    /** URL of the slide image. */
    image: string;
    /** Alternative text for the image; empty when the image is decorative. */
    alt?: string;
}

export interface LoginCarouselProps {
    /** The slides to cycle through. */
    slides: LoginCarouselSlide[];
    /** Milliseconds between automatic advances; 0 turns autoplay off. */
    interval?: number;
    /** Accessible name for the carousel region. */
    label?: string;
    /** Accessible name for the previous button. */
    previouslabel?: string;
    /** Accessible name for the next button. */
    nextlabel?: string;
    /** Accessible name for an indicator, with {$a} replaced by the slide number. */
    slidelabel?: string;
}

/**
 * Whether the user has asked the operating system to minimise motion.
 *
 * @returns True when reduced motion is preferred.
 */
const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Chevron icon used by the previous/next buttons.
 *
 * @param props Component props.
 * @param props.direction Which way the chevron points.
 * @returns The icon.
 */
function Chevron({direction}: {direction: 'previous' | 'next'}) {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d={direction === 'previous' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
        </svg>
    );
}

/**
 * Render the login carousel: a headline and image per slide, with previous/next buttons and indicators.
 *
 * Autoplay pauses while the pointer is over the carousel or focus is inside it, and is off entirely
 * when the user prefers reduced motion.
 *
 * @param props Component props.
 * @returns The rendered carousel, or nothing when there are no slides.
 */
export default function LoginCarousel({
    slides,
    interval = 6000,
    label = 'Highlights',
    previouslabel = 'Previous slide',
    nextlabel = 'Next slide',
    slidelabel = 'Go to slide {$a}',
}: LoginCarouselProps) {
    const count = slides?.length ?? 0;
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    const go = useCallback((index: number) => {
        if (count > 0) {
            setActive((index + count) % count);
        }
    }, [count]);

    useEffect(() => {
        if (count < 2 || paused || interval <= 0 || prefersReducedMotion()) {
            return undefined;
        }
        const timer = window.setInterval(() => setActive((current) => (current + 1) % count), interval);
        return () => window.clearInterval(timer);
    }, [count, paused, interval]);

    if (count === 0) {
        return null;
    }

    const slide = slides[Math.min(active, count - 1)];

    return (
        <section
            className="login-carousel"
            aria-roledescription="carousel"
            aria-label={label}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setPaused(false);
                }
            }}
        >
            <div className="login-carousel-copy" aria-live={paused ? 'polite' : 'off'}>
                <h2 key={`title-${active}`} className="login-carousel-title">“{slide.title}”</h2>
                <p key={`body-${active}`} className="login-carousel-body">{slide.body}</p>
            </div>

            <div className="login-carousel-frame">
                <div className="login-carousel-backdrop" aria-hidden="true" />
                <div className="login-carousel-viewport">
                    {slides.map((item, index) => (
                        <img
                            key={item.image}
                            className={`login-carousel-image${index === active ? ' is-active' : ''}`}
                            src={item.image}
                            alt={index === active ? (item.alt ?? '') : ''}
                            aria-hidden={index === active ? undefined : true}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                        />
                    ))}
                </div>
            </div>

            {count > 1 && (
                <div className="login-carousel-nav">
                    <button type="button" className="login-carousel-arrow" aria-label={previouslabel}
                        onClick={() => go(active - 1)}>
                        <Chevron direction="previous" />
                    </button>
                    <div className="login-carousel-indicators">
                        {slides.map((item, index) => (
                            <button
                                key={item.image}
                                type="button"
                                className={`login-carousel-indicator${index === active ? ' is-active' : ''}`}
                                aria-label={slidelabel.replace('{$a}', String(index + 1))}
                                aria-current={index === active ? 'true' : undefined}
                                onClick={() => go(index)}
                            />
                        ))}
                    </div>
                    <button type="button" className="login-carousel-arrow" aria-label={nextlabel}
                        onClick={() => go(active + 1)}>
                        <Chevron direction="next" />
                    </button>
                </div>
            )}
        </section>
    );
}
