var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * Navigation menu of the left bar: top-level links and expandable groups of child links.
 *
 * @module     theme_retani_studio/leftbar/NavigationMenu
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useId, useState } from "react";
import { Caret, Icon } from "./icons";
function ItemTile({ item }) {
  return /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-tile", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV(Icon, { name: item.icon }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 53,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 52,
    columnNumber: 9
  }, this);
}
__name(ItemTile, "ItemTile");
function NavLink({ item, collapsed }) {
  return /* @__PURE__ */ jsxDEV(
    "a",
    {
      className: `retani-leftbar-item${item.active ? " is-active" : ""}`,
      href: item.url,
      title: collapsed ? item.label : void 0,
      "aria-current": item.active ? "page" : void 0,
      ...item.external ? { target: "_blank", rel: "noopener noreferrer" } : {},
      children: [
        /* @__PURE__ */ jsxDEV(ItemTile, { item }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
          lineNumber: 75,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: collapsed ? "visually-hidden" : "retani-leftbar-label", children: item.label }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
      lineNumber: 68,
      columnNumber: 9
    },
    this
  );
}
__name(NavLink, "NavLink");
function NavGroup({ item, collapsed, open, onToggle }) {
  const listid = useId();
  const expanded = open && !collapsed;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: `retani-leftbar-item${item.active ? " is-active" : ""}${expanded ? " is-open" : ""}`,
        title: collapsed ? item.label : void 0,
        "aria-expanded": expanded,
        "aria-controls": listid,
        onClick: () => onToggle(item.key),
        children: [
          /* @__PURE__ */ jsxDEV(ItemTile, { item }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
            lineNumber: 100,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: collapsed ? "visually-hidden" : "retani-leftbar-label", children: item.label }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
            lineNumber: 101,
            columnNumber: 17
          }, this),
          !collapsed && /* @__PURE__ */ jsxDEV(Caret, {}, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
            lineNumber: 102,
            columnNumber: 32
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
        lineNumber: 92,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("ul", { className: "retani-leftbar-children", id: listid, hidden: !expanded, children: item.children.map((child) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
      "a",
      {
        className: `retani-leftbar-child${child.active ? " is-active" : ""}`,
        href: child.url,
        "aria-current": child.active ? "page" : void 0,
        children: [
          /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-dot", "aria-hidden": "true" }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
            lineNumber: 112,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-label", children: child.label }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
            lineNumber: 113,
            columnNumber: 29
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
        lineNumber: 107,
        columnNumber: 25
      },
      this
    ) }, child.url, false, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
      lineNumber: 106,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
      lineNumber: 104,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 91,
    columnNumber: 9
  }, this);
}
__name(NavGroup, "NavGroup");
function NavigationMenu({ items, collapsed, onExpand, className = "" }) {
  const [openkeys, setOpenkeys] = useState(
    () => new Set(items.filter((item) => item.active && item.children.length > 0).map((item) => item.key))
  );
  const onToggle = useCallback((key) => {
    if (collapsed) {
      onExpand();
      setOpenkeys((current) => new Set(current).add(key));
      return;
    }
    setOpenkeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, [collapsed, onExpand]);
  return /* @__PURE__ */ jsxDEV("ul", { className: `retani-leftbar-menu ${className}`.trim(), children: items.map((item) => /* @__PURE__ */ jsxDEV("li", { className: "retani-leftbar-menuitem", children: item.children.length > 0 ? /* @__PURE__ */ jsxDEV(NavGroup, { item, collapsed, open: openkeys.has(item.key), onToggle }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 158,
    columnNumber: 25
  }, this) : /* @__PURE__ */ jsxDEV(NavLink, { item, collapsed }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 160,
    columnNumber: 25
  }, this) }, item.key, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 156,
    columnNumber: 17
  }, this)) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/NavigationMenu.tsx",
    lineNumber: 154,
    columnNumber: 9
  }, this);
}
__name(NavigationMenu, "NavigationMenu");
export {
  NavigationMenu as default
};
//# sourceMappingURL=NavigationMenu.dev.js.map
