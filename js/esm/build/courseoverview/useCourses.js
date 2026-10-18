import{useEffect as x,useRef as b,useState as y}from"react";import{getCourseDetails as h,getCoursePage as D}from"./services/courses";/**
 * Load a page of courses, then their extra details, for the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/useCourses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const g={rows:[],loading:!0,failed:!1,hasnext:!1,nextoffset:0};function S({filter:u,search:l,sort:i,limit:t,offset:a}){const[m,s]=y(g),f=b(0);return x(()=>{const p=++f.current,o=()=>p===f.current;s(r=>({...r,loading:!0,failed:!1})),(async()=>{let r;try{r=await D({filter:u,search:l,sort:i,limit:t,offset:a})}catch{o()&&s({...g,loading:!1,failed:!0});return}if(!o())return;const{courses:n,nextoffset:c}=r;s({rows:n.map(e=>({...e,details:null})),loading:!1,failed:!1,hasnext:t>0&&n.length>=t&&c>a,nextoffset:c});let d;try{d=await h(n.map(e=>e.id))}catch{return}if(!o())return;const w=new Map(d.map(e=>[e.id,e]));s(e=>({...e,rows:e.rows.map(C=>({...C,details:w.get(C.id)??null}))}))})()},[u,l,i,t,a]),m}export{S as default};
