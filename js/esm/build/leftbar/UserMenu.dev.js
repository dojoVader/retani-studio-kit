var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * User menu pinned to the bottom of the left bar.
 *
 * @module     theme_retani_studio/leftbar/UserMenu
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useId, useRef } from "react";
import { Caret } from "./icons";
import useDismiss from "./useDismiss";
function Avatar({ user }) {
  return /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-avatar", "aria-hidden": "true", children: user.hasavatar ? /* @__PURE__ */ jsxDEV("img", { src: user.avatarurl, alt: "" }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
    lineNumber: 48,
    columnNumber: 31
  }, this) : user.initials }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
    lineNumber: 47,
    columnNumber: 9
  }, this);
}
__name(Avatar, "Avatar");
function UserMenu({ user, collapsed, open, onToggle, onClose, label }) {
  const wrapper = useRef(null);
  const toggle = useRef(null);
  const menuid = useId();
  useDismiss(open, wrapper, onClose, toggle);
  return /* @__PURE__ */ jsxDEV("div", { className: `retani-leftbar-user${open ? " is-open" : ""}`, ref: wrapper, children: [
    open && /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-dropdown retani-leftbar-usermenu", id: menuid, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-dropdown-heading retani-leftbar-userdetails", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-username", children: user.fullname }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
          lineNumber: 72,
          columnNumber: 25
        }, this),
        user.email && /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-useremail", children: user.email }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
          lineNumber: 73,
          columnNumber: 40
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
        lineNumber: 71,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { className: "retani-leftbar-userlist", children: user.items.map((item) => /* @__PURE__ */ jsxDEV("li", { className: item.divider ? "has-divider" : void 0, children: /* @__PURE__ */ jsxDEV(
        "a",
        {
          className: `retani-leftbar-useroption${item.danger ? " is-danger" : ""}`,
          href: item.url,
          children: item.label
        },
        void 0,
        false,
        {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
          lineNumber: 78,
          columnNumber: 33
        },
        this
      ) }, item.key, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
        lineNumber: 77,
        columnNumber: 29
      }, this)) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
        lineNumber: 75,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
      lineNumber: 70,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: toggle,
        type: "button",
        className: "retani-leftbar-usertoggle",
        "aria-expanded": open,
        "aria-controls": menuid,
        "aria-label": `${label}: ${user.fullname}`,
        title: collapsed ? user.fullname : void 0,
        onClick: onToggle,
        children: [
          /* @__PURE__ */ jsxDEV(Avatar, { user }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
            lineNumber: 97,
            columnNumber: 17
          }, this),
          !collapsed && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-usertext", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-username", children: user.fullname }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
                lineNumber: 101,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-userrole", children: user.role || user.email }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
                lineNumber: 102,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
              lineNumber: 100,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(Caret, { up: true }, void 0, false, {
              fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
              lineNumber: 104,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
            lineNumber: 99,
            columnNumber: 21
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
        lineNumber: 87,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/UserMenu.tsx",
    lineNumber: 68,
    columnNumber: 9
  }, this);
}
__name(UserMenu, "UserMenu");
export {
  UserMenu as default
};
//# sourceMappingURL=UserMenu.dev.js.map
