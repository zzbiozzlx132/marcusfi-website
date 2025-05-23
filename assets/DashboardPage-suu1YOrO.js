import{c as t,N as c,j as e,O as o,m as i,Q as d,G as m}from"./index-BF0z3Gyh.js";import{W as h}from"./wallet-DISnujNS.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]],p=t("arrow-down-right",x);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],y=t("arrow-up-right",g);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]],u=t("chart-line",v),f=()=>{const{user:a,isAuthenticated:n}=c();if(!n)return e.jsx(o,{to:"/signup",replace:!0});const l=[{title:"Total Balance",value:"$24,563.00",change:"+2.5%",isPositive:!0,icon:h},{title:"Monthly Savings",value:"$3,245.00",change:"+15.3%",isPositive:!0,icon:d},{title:"Monthly Expenses",value:"$2,145.00",change:"-4.3%",isPositive:!1,icon:m}];return e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"container mx-auto px-4 py-8",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold text-gray-900",children:["Welcome back, ",(a==null?void 0:a.name)||"User"]}),e.jsx("p",{className:"text-gray-600 mt-2",children:"Here's an overview of your financial health"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",children:l.map((s,r)=>e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:r*.1},className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"p-2 bg-purple-100 rounded-lg",children:e.jsx(s.icon,{className:"w-6 h-6 text-purple-600"})}),e.jsxs("span",{className:`flex items-center text-sm ${s.isPositive?"text-green-600":"text-red-600"}`,children:[s.change,s.isPositive?e.jsx(y,{className:"w-4 h-4 ml-1"}):e.jsx(p,{className:"w-4 h-4 ml-1"})]})]}),e.jsx("h2",{className:"text-gray-600 text-sm font-medium",children:s.title}),e.jsx("p",{className:"text-2xl font-bold text-gray-900 mt-1",children:s.value})]},s.title))}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Financial Overview"}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(u,{className:"w-5 h-5 text-purple-600"}),e.jsx("span",{className:"text-sm text-gray-600",children:"Last 30 days"})]})]}),e.jsx("div",{className:"h-64 flex items-center justify-center text-gray-500",children:"Chart placeholder - Integration pending"})]})]})};export{f as default};
