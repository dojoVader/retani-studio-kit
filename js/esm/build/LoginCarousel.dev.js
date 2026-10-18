var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Image carousel for the left panel of the login page.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/LoginCarousel"
 * by core/react_autoinit, from the {{#react}} helper in theme_retani_studio/core/login_panel.
 *
 * @module     theme_retani_studio/LoginCarousel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useEffect, useState } from "react";
const prefersReducedMotion = /* @__PURE__ */ __name(() => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, "prefersReducedMotion");
function Chevron({ direction }) {
  return /* @__PURE__ */ jsxDEV(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      children: /* @__PURE__ */ jsxDEV("path", { d: direction === "previous" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7" }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
        lineNumber: 75,
        columnNumber: 13
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
      lineNumber: 73,
      columnNumber: 9
    },
    this
  );
}
__name(Chevron, "Chevron");
function LoginCarousel({
  slides,
  interval = 6e3,
  label = "Highlights",
  previouslabel = "Previous slide",
  nextlabel = "Next slide",
  slidelabel = "Go to slide {$a}"
}) {
  const count = slides?.length ?? 0;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((index) => {
    if (count > 0) {
      setActive((index + count) % count);
    }
  }, [count]);
  useEffect(() => {
    if (count < 2 || paused || interval <= 0 || prefersReducedMotion()) {
      return void 0;
    }
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), interval);
    return () => window.clearInterval(timer);
  }, [count, paused, interval]);
  if (count === 0) {
    return null;
  }
  const slide = slides[Math.min(active, count - 1)];
  return /* @__PURE__ */ jsxDEV(
    "section",
    {
      className: "login-carousel",
      "aria-roledescription": "carousel",
      "aria-label": label,
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocus: () => setPaused(true),
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setPaused(false);
        }
      },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-copy", "aria-live": paused ? "polite" : "off", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "login-carousel-title", children: [
            "\u201C",
            slide.title,
            "\u201D"
          ] }, `title-${active}`, true, {
            fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
            lineNumber: 136,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "login-carousel-body", children: slide.body }, `body-${active}`, false, {
            fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
            lineNumber: 137,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-frame", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-backdrop", "aria-hidden": "true" }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
            lineNumber: 141,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-viewport", children: slides.map((item, index) => /* @__PURE__ */ jsxDEV(
            "img",
            {
              className: `login-carousel-image${index === active ? " is-active" : ""}`,
              src: item.image,
              alt: index === active ? item.alt ?? "" : "",
              "aria-hidden": index === active ? void 0 : true,
              loading: index === 0 ? "eager" : "lazy",
              decoding: "async"
            },
            item.image,
            false,
            {
              fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
              lineNumber: 144,
              columnNumber: 25
            },
            this
          )) }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
            lineNumber: 142,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
          lineNumber: 140,
          columnNumber: 13
        }, this),
        count > 1 && /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-nav", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "login-carousel-arrow",
              "aria-label": previouslabel,
              onClick: () => go(active - 1),
              children: /* @__PURE__ */ jsxDEV(Chevron, { direction: "previous" }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
                lineNumber: 161,
                columnNumber: 25
              }, this)
            },
            void 0,
            false,
            {
              fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
              lineNumber: 159,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "login-carousel-indicators", children: slides.map((item, index) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: `login-carousel-indicator${index === active ? " is-active" : ""}`,
              "aria-label": slidelabel.replace("{$a}", String(index + 1)),
              "aria-current": index === active ? "true" : void 0,
              onClick: () => go(index)
            },
            item.image,
            false,
            {
              fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
              lineNumber: 165,
              columnNumber: 29
            },
            this
          )) }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
            lineNumber: 163,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "login-carousel-arrow",
              "aria-label": nextlabel,
              onClick: () => go(active + 1),
              children: /* @__PURE__ */ jsxDEV(Chevron, { direction: "next" }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
                lineNumber: 177,
                columnNumber: 25
              }, this)
            },
            void 0,
            false,
            {
              fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
              lineNumber: 175,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
          lineNumber: 158,
          columnNumber: 17
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "public/theme/retani_studio/js/esm/src/LoginCarousel.tsx",
      lineNumber: 122,
      columnNumber: 9
    },
    this
  );
}
__name(LoginCarousel, "LoginCarousel");
export {
  LoginCarousel as default
};
//# sourceMappingURL=LoginCarousel.dev.js.map
