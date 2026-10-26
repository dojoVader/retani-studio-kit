import{useEffect as c}from"react";/**
 * Close a dropdown on a click outside it or on Escape.
 *
 * @module     theme_retani_studio/leftbar/useDismiss
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function i(o,e,n,d){c(()=>{if(!o)return;const r=t=>{e.current&&!e.current.contains(t.target)&&n()},u=t=>{t.key==="Escape"&&(n(),d?.current?.focus())};return document.addEventListener("mousedown",r),document.addEventListener("keydown",u),()=>{document.removeEventListener("mousedown",r),document.removeEventListener("keydown",u)}},[o,e,n,d])}export{i as default};
