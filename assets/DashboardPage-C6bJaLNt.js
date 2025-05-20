import{c as s,K as r,j as e,N as o,m as i}from"./index-BmBym7dF.js";import{D as d}from"./dollar-sign-CFk8vxG6.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]],m=s("arrow-down-right",h);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],p=s("arrow-up-right",x);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]],y=s("chart-line",v);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",key:"1piglc"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M2 8v1a2 2 0 0 0 2 2h1",key:"1env43"}]],u=s("piggy-bank",g);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]],N=s("wallet",j),w=()=>{const{user:t,isAuthenticated:n}=r();if(!n)return e.jsx(o,{to:"/signup",replace:!0});const c=[{title:"Total Balance",value:"$24,563.00",change:"+2.5%",isPositive:!0,icon:N},{title:"Monthly Savings",value:"$3,245.00",change:"+15.3%",isPositive:!0,icon:u},{title:"Monthly Expenses",value:"$2,145.00",change:"-4.3%",isPositive:!1,icon:d}];return e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"container mx-auto px-4 py-8",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold text-gray-900",children:["Welcome back, ",(t==null?void 0:t.name)||"User"]}),e.jsx("p",{className:"text-gray-600 mt-2",children:"Here's an overview of your financial health"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",children:c.map((a,l)=>e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:l*.1},className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"p-2 bg-purple-100 rounded-lg",children:e.jsx(a.icon,{className:"w-6 h-6 text-purple-600"})}),e.jsxs("span",{className:`flex items-center text-sm ${a.isPositive?"text-green-600":"text-red-600"}`,children:[a.change,a.isPositive?e.jsx(p,{className:"w-4 h-4 ml-1"}):e.jsx(m,{className:"w-4 h-4 ml-1"})]})]}),e.jsx("h2",{className:"text-gray-600 text-sm font-medium",children:a.title}),e.jsx("p",{className:"text-2xl font-bold text-gray-900 mt-1",children:a.value})]},a.title))}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Financial Overview"}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(y,{className:"w-5 h-5 text-purple-600"}),e.jsx("span",{className:"text-sm text-gray-600",children:"Last 30 days"})]})]}),e.jsx("div",{className:"h-64 flex items-center justify-center text-gray-500",children:"Chart placeholder - Integration pending"})]})]})};export{w as default};
