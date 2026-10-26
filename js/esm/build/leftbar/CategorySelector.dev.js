var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * Course category selector dropdown at the top of the left bar.
 *
 * @module     theme_retani_studio/leftbar/CategorySelector
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useId, useRef } from "react";
import { CATEGORY_STYLES, Caret, Check, Icon } from "./icons";
import useDismiss from "./useDismiss";
function CategoryTile({ index, small = false }) {
  const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
  return /* @__PURE__ */ jsxDEV(
    "span",
    {
      className: `retani-leftbar-cattile${small ? " is-small" : ""}`,
      style: { background: style.gradient },
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxDEV(Icon, { path: style.path, size: small ? 16 : 20 }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 50,
        columnNumber: 13
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
      lineNumber: 48,
      columnNumber: 9
    },
    this
  );
}
__name(CategoryTile, "CategoryTile");
const metaLine = /* @__PURE__ */ __name((category, countlabel, withcount) => {
  const count = countlabel.replace("{$a}", String(category.coursecount));
  if (!withcount) {
    return category.code || count;
  }
  return category.code ? `${category.code} \xB7 ${count}` : count;
}, "metaLine");
function CategorySelector({ data, collapsed, open, onToggle, onClose, strings }) {
  const wrapper = useRef(null);
  const toggle = useRef(null);
  const menuid = useId();
  useDismiss(open, wrapper, onClose, toggle);
  if (data.items.length === 0) {
    return null;
  }
  const selectedindex = Math.max(0, data.items.findIndex((c) => c.id === data.selected));
  const selected = data.items[selectedindex];
  return /* @__PURE__ */ jsxDEV("div", { className: `retani-leftbar-category${open ? " is-open" : ""}`, ref: wrapper, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: toggle,
        type: "button",
        className: "retani-leftbar-cattoggle",
        "aria-expanded": open,
        "aria-controls": menuid,
        title: collapsed ? `${strings.switchcategory}: ${selected.name}` : strings.switchcategory,
        onClick: onToggle,
        children: [
          /* @__PURE__ */ jsxDEV(CategoryTile, { index: selectedindex }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
            lineNumber: 103,
            columnNumber: 17
          }, this),
          collapsed ? /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: `${strings.switchcategory}: ${selected.name}` }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
            lineNumber: 105,
            columnNumber: 21
          }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-cattext", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-catname", children: selected.name }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 109,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-catmeta", children: metaLine(selected, strings.coursecount, false) }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 110,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
              lineNumber: 108,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(Caret, {}, void 0, false, {
              fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
              lineNumber: 114,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
            lineNumber: 107,
            columnNumber: 21
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 94,
        columnNumber: 13
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-dropdown retani-leftbar-catmenu", id: menuid, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-dropdown-heading", children: strings.categories }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 121,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { className: "retani-leftbar-catlist", children: data.items.map((category, index) => {
        const isselected = index === selectedindex;
        return /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
          "a",
          {
            className: `retani-leftbar-catoption${isselected ? " is-selected" : ""}`,
            href: category.url,
            "aria-current": isselected ? "true" : void 0,
            children: [
              /* @__PURE__ */ jsxDEV(CategoryTile, { index, small: true }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 132,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-cattext", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-catname", children: category.name }, void 0, false, {
                  fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                  lineNumber: 134,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-catmeta", children: metaLine(category, strings.coursecount, true) }, void 0, false, {
                  fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                  lineNumber: 135,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 133,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-catcheck", children: /* @__PURE__ */ jsxDEV(Check, {}, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 139,
                columnNumber: 83
              }, this) }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
                lineNumber: 139,
                columnNumber: 41
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
            lineNumber: 127,
            columnNumber: 37
          },
          this
        ) }, category.id, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
          lineNumber: 126,
          columnNumber: 33
        }, this);
      }) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 122,
        columnNumber: 21
      }, this),
      data.manageurl && /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-dropdown-footer", children: /* @__PURE__ */ jsxDEV("a", { href: data.manageurl, children: data.managelabel }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 147,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
        lineNumber: 146,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
      lineNumber: 120,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/CategorySelector.tsx",
    lineNumber: 93,
    columnNumber: 9
  }, this);
}
__name(CategorySelector, "CategorySelector");
export {
  CategorySelector as default
};
//# sourceMappingURL=CategorySelector.dev.js.map
