import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{u as t}from"./router-B-JDBtYp.js";import{n}from"./animal-BWgbA56x.js";import{t as r}from"./ToolLayout-Cuv2Di9V.js";var i=e(t(),1),a=n();function o(e){if(!e.trim())return``;let t=e.split(/\n\s*\n/),n=[];for(let e of t){let t=e.split(`
`).map(e=>e.trim()).filter(Boolean);if(t.length!==0)if(t.every(e=>/^[-*]\s+/.test(e))&&t.length>0){let e=t.map(e=>`  <li>${e.replace(/^[-*]\s+/,``)}</li>`).join(`
`);n.push(`<ul>
`+e+`
</ul>`)}else{let e=t.join(`<br>
`);n.push(`<p>${e}</p>`)}}return n.join(`
`)}function s(){let[e,t]=(0,i.useState)(``),[n,s]=(0,i.useState)(``),c=(0,i.useCallback)(()=>{s(o(e))},[e]);return(0,a.jsx)(r,{toolId:`text-to-html`,title:`文本转HTML工具`,description:`将纯文本转换为HTML格式，支持段落、换行和列表转换`,inputValue:e,onInputChange:e=>{t(e)},outputValue:n,inputPlaceholder:`在此粘贴纯文本，将自动转换为HTML...`,extraActions:(0,a.jsx)(`button`,{style:{padding:`8px 20px`,borderRadius:12,border:`1px solid var(--border-color)`,background:`var(--color-teal)`,color:`#fff`,fontSize:13,fontWeight:600,fontFamily:`var(--font-sans)`,cursor:`pointer`,boxShadow:`0 2px 0 #5aab8a`,transition:`all 150ms ease`},onClick:c,children:`转换`})})}export{s as default};