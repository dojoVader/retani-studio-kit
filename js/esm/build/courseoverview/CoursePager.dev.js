var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Previous / next paging under the course table.
 *
 * @module     theme_retani_studio/courseoverview/CoursePager
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Icon, PATHS } from "./icons";
function CoursePager({ page, hasprevious, hasnext, disabled, onPrevious, onNext, strings }) {
  if (!hasprevious && !hasnext) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("nav", { className: "retani-courseoverview-pager", "aria-label": strings.page.replace("{$a}", String(page + 1)), children: [
    /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-pagestatus", "aria-live": "polite", children: strings.page.replace("{$a}", String(page + 1)) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
      lineNumber: 49,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "retani-courseoverview-iconbtn",
        "aria-label": strings.previous,
        title: strings.previous,
        disabled: disabled || !hasprevious,
        onClick: onPrevious,
        children: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.previous, size: 13, strokeWidth: 2.2 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
          lineNumber: 54,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
        lineNumber: 52,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "retani-courseoverview-iconbtn",
        "aria-label": strings.next,
        title: strings.next,
        disabled: disabled || !hasnext,
        onClick: onNext,
        children: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.next, size: 13, strokeWidth: 2.2 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
          lineNumber: 58,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
        lineNumber: 56,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CoursePager.tsx",
    lineNumber: 48,
    columnNumber: 9
  }, this);
}
__name(CoursePager, "CoursePager");
export {
  CoursePager as default
};
//# sourceMappingURL=CoursePager.dev.js.map
