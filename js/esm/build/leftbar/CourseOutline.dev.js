var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * "Current course" row and the course outline it toggles, under the category selector of the left bar.
 *
 * The outline is Moodle's own course index (a reactive core_courseformat component), rendered by the page in
 * the course index drawer inside theme_retani_studio/retani/course_outline. While the bar is on screen (wide
 * screens) that element is moved into the slot rendered here; when the screen gets too narrow for the bar it is
 * moved back into the drawer, so the course index stays reachable there.
 *
 * @module     theme_retani_studio/leftbar/CourseOutline
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef } from "react";
import { Icon } from "./icons";
const OUTLINE_SELECTOR = '[data-region="retani-courseoutline"]';
const WIDE_QUERY = "(min-width: 992px)";
function CourseRow({ course, collapsed, open, onToggle, strings, panelid }) {
  const label = `${strings.courseoutline}: ${course.name}`;
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-course", children: /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      className: `retani-leftbar-coursetoggle${open ? " is-open" : ""}`,
      "aria-expanded": open,
      "aria-controls": panelid,
      title: collapsed ? label : strings.courseoutline,
      onClick: onToggle,
      children: [
        collapsed ? /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: label }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
          lineNumber: 68,
          columnNumber: 21
        }, this) : /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-coursetext", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-coursecaption", children: strings.currentcourse }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
            lineNumber: 71,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-coursename", children: course.name }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
            lineNumber: 72,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
          lineNumber: 70,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-coursetile", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV(Icon, { name: "outline", size: 14 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
          lineNumber: 76,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
          lineNumber: 75,
          columnNumber: 17
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
      lineNumber: 59,
      columnNumber: 13
    },
    this
  ) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
    lineNumber: 58,
    columnNumber: 9
  }, this);
}
__name(CourseRow, "CourseRow");
function CourseOutline({ visible, id, label }) {
  const slot = useRef(null);
  useEffect(() => {
    const target = slot.current;
    const outline = document.querySelector(OUTLINE_SELECTOR);
    const home = outline?.parentElement;
    if (!target || !outline || !home) {
      return void 0;
    }
    const marker = document.createComment("retani-courseoutline");
    home.insertBefore(marker, outline);
    const media = window.matchMedia(WIDE_QUERY);
    const place = /* @__PURE__ */ __name(() => {
      if (media.matches) {
        target.appendChild(outline);
      } else {
        marker.parentNode?.insertBefore(outline, marker.nextSibling);
      }
    }, "place");
    place();
    media.addEventListener("change", place);
    return () => {
      media.removeEventListener("change", place);
      marker.parentNode?.insertBefore(outline, marker.nextSibling);
      marker.remove();
    };
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-outline", id, role: "region", "aria-label": label, hidden: !visible, children: /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-outline-slot", ref: slot }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
    lineNumber: 132,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/CourseOutline.tsx",
    lineNumber: 131,
    columnNumber: 9
  }, this);
}
__name(CourseOutline, "CourseOutline");
export {
  CourseOutline,
  CourseRow
};
//# sourceMappingURL=CourseOutline.dev.js.map
