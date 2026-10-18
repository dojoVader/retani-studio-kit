var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Close a dropdown on a click outside it or on Escape.
 *
 * @module     theme_retani_studio/leftbar/useDismiss
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect } from "react";
function useDismiss(open, ref, onDismiss, returnFocus) {
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    const onPointer = /* @__PURE__ */ __name((e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onDismiss();
      }
    }, "onPointer");
    const onKey = /* @__PURE__ */ __name((e) => {
      if (e.key === "Escape") {
        onDismiss();
        returnFocus?.current?.focus();
      }
    }, "onKey");
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, ref, onDismiss, returnFocus]);
}
__name(useDismiss, "useDismiss");
export {
  useDismiss as default
};
//# sourceMappingURL=useDismiss.dev.js.map
