var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * Card header of the course overview: title, search, filter menu and the block's course actions.
 *
 * @module     theme_retani_studio/courseoverview/CourseToolbar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useRef, useState } from "react";
import useDismiss from "../leftbar/useDismiss";
import { Caret, Grid, Icon, More, PATHS } from "./icons";
function ViewSwitch({ view, onView, strings }) {
  const options = [
    { view: "card", label: strings.cardview, glyph: /* @__PURE__ */ jsxDEV(Grid, {}, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 56,
      columnNumber: 56
    }, this) },
    { view: "list", label: strings.listview, glyph: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.list, size: 13, strokeWidth: 2 }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 57,
      columnNumber: 56
    }, this) }
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-viewswitch", children: options.map((option) => /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      title: option.label,
      "aria-label": option.label,
      "aria-pressed": view === option.view,
      className: view === option.view ? "is-active" : void 0,
      onClick: () => onView(option.view),
      children: option.glyph
    },
    option.view,
    false,
    {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 62,
      columnNumber: 17
    },
    this
  )) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
    lineNumber: 60,
    columnNumber: 9
  }, this);
}
__name(ViewSwitch, "ViewSwitch");
function SearchControl({ value, onChange, label }) {
  const [open, setOpen] = useState(value !== "");
  const input = useRef(null);
  const fieldid = useId();
  useEffect(() => {
    if (open) {
      input.current?.focus();
    }
  }, [open]);
  if (!open) {
    return /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "retani-courseoverview-iconbtn",
        title: label,
        "aria-label": label,
        onClick: () => setOpen(true),
        children: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.search, size: 13, strokeWidth: 2 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 96,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
        lineNumber: 94,
        columnNumber: 13
      },
      this
    );
  }
  const close = /* @__PURE__ */ __name(() => {
    onChange("");
    setOpen(false);
  }, "close");
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-search", children: [
    /* @__PURE__ */ jsxDEV("label", { htmlFor: fieldid, className: "visually-hidden", children: label }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 108,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.search, size: 13, strokeWidth: 2 }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 109,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        ref: input,
        id: fieldid,
        type: "search",
        value,
        placeholder: label,
        onChange: (e) => onChange(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            close();
          }
        }
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
        lineNumber: 110,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("button", { type: "button", className: "retani-courseoverview-searchclear", "aria-label": label, onClick: close, children: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.close, size: 10, strokeWidth: 2.2 }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 124,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 123,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
    lineNumber: 107,
    columnNumber: 9
  }, this);
}
__name(SearchControl, "SearchControl");
function Menu({ label, button, className = "", children }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const toggle = useRef(null);
  const menuid = useId();
  const close = /* @__PURE__ */ __name(() => setOpen(false), "close");
  useDismiss(open, wrapper, close, toggle);
  return /* @__PURE__ */ jsxDEV("div", { className: `retani-courseoverview-menu${open ? " is-open" : ""}`, ref: wrapper, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: toggle,
        type: "button",
        className,
        "aria-label": label,
        "aria-expanded": open,
        "aria-controls": menuid,
        onClick: () => setOpen(!open),
        children: button
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
        lineNumber: 155,
        columnNumber: 13
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-dropdown", id: menuid, children: children(close) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 159,
      columnNumber: 22
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
    lineNumber: 154,
    columnNumber: 9
  }, this);
}
__name(Menu, "Menu");
function CourseToolbar({
  filters,
  filter,
  onFilter,
  search,
  onSearch,
  view,
  views,
  onView,
  actions,
  strings
}) {
  const filtered = filters.length > 0 && filter.key !== filters[0].key;
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-header", role: "search", "aria-label": strings.controls, children: [
    /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-tile", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.courses, size: 17, strokeWidth: 2.1 }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 177,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 176,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("h2", { className: "retani-courseoverview-title", children: strings.title }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 179,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(SearchControl, { value: search, onChange: onSearch, label: strings.search }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 181,
      columnNumber: 13
    }, this),
    filters.length > 1 && /* @__PURE__ */ jsxDEV(
      Menu,
      {
        label: `${strings.filter}: ${filter.label}`,
        className: "retani-courseoverview-pillbtn",
        button: /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.filter, size: 13, strokeWidth: 2 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
            lineNumber: 189,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: filtered ? filter.label : strings.filter }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
            lineNumber: 190,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV(Caret, {}, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
            lineNumber: 191,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 188,
          columnNumber: 25
        }, this),
        children: (close) => /* @__PURE__ */ jsxDEV("ul", { className: "retani-courseoverview-options", children: filters.map((option) => {
          const selected = option.key === filter.key;
          return /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: `retani-courseoverview-option${selected ? " is-selected" : ""}`,
              "aria-pressed": selected,
              onClick: () => {
                onFilter(option);
                close();
              },
              children: [
                /* @__PURE__ */ jsxDEV("span", { children: option.label }, void 0, false, {
                  fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
                  lineNumber: 210,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.check, size: 12, strokeWidth: 2.6 }, void 0, false, {
                  fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
                  lineNumber: 211,
                  columnNumber: 45
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
              lineNumber: 201,
              columnNumber: 41
            },
            this
          ) }, option.key, false, {
            fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
            lineNumber: 200,
            columnNumber: 37
          }, this);
        }) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 196,
          columnNumber: 25
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
        lineNumber: 184,
        columnNumber: 17
      },
      this
    ),
    views.length > 1 && /* @__PURE__ */ jsxDEV(ViewSwitch, { view, onView, strings }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
      lineNumber: 221,
      columnNumber: 34
    }, this),
    actions.length > 0 && /* @__PURE__ */ jsxDEV(
      Menu,
      {
        label: actions.map((a) => a.label).join(", "),
        className: "retani-courseoverview-morebtn",
        button: /* @__PURE__ */ jsxDEV(More, {}, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 225,
          columnNumber: 29
        }, this),
        children: () => /* @__PURE__ */ jsxDEV("ul", { className: "retani-courseoverview-options", children: actions.map((action) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", { className: "retani-courseoverview-option", href: action.url, children: action.label }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 230,
          columnNumber: 37
        }, this) }, action.url, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 229,
          columnNumber: 33
        }, this)) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
          lineNumber: 227,
          columnNumber: 25
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
        lineNumber: 224,
        columnNumber: 17
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseToolbar.tsx",
    lineNumber: 175,
    columnNumber: 9
  }, this);
}
__name(CourseToolbar, "CourseToolbar");
export {
  CourseToolbar as default
};
//# sourceMappingURL=CourseToolbar.dev.js.map
