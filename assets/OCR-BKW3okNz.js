import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{u as t}from"./router-B-JDBtYp.js";import{n}from"./animal-BWgbA56x.js";import{t as r}from"./index-BtA5Iip7.js";import{t as i}from"./ToolLayout-Cuv2Di9V.js";var a=e(t(),1),o=n(),s={padding:`8px 16px`,borderRadius:10,border:`1px solid var(--border-color)`,background:`var(--bg-card)`,color:`var(--text-primary)`,fontSize:13,fontWeight:600,cursor:`pointer`,fontFamily:`var(--font-sans)`,boxShadow:`0 2px 0 var(--border-color)`,transition:`all 150ms ease`},c={...s,background:`var(--color-purple)`,color:`#fff`,borderColor:`var(--color-purple)`},l={fontSize:12,fontWeight:600,color:`var(--text-secondary)`,marginBottom:4,fontFamily:`var(--font-sans)`},u={padding:`12px 16px`,borderRadius:12,background:`#fff8e1`,border:`1px solid #ffc107`,fontSize:13,color:`#5d4037`,fontFamily:`var(--font-sans)`,marginBottom:16,lineHeight:1.6},d={marginBottom:16,textAlign:`center`},f={maxWidth:400,maxHeight:400,borderRadius:12,border:`1px solid var(--border-color)`,objectFit:`contain`},p={padding:16,borderRadius:12,background:`var(--bg-tool)`,border:`1px solid var(--border-light)`,fontFamily:`"Fira Code", "Noto Sans SC", var(--font-sans)`,fontSize:13,lineHeight:1.7,color:`var(--text-primary)`,whiteSpace:`pre-wrap`,maxHeight:400,overflow:`auto`},m={display:`flex`,alignItems:`center`,gap:10,justifyContent:`center`,padding:20,fontSize:14,color:`var(--text-secondary)`,fontFamily:`var(--font-sans)`};function h(){let[e,t]=(0,a.useState)(``),[n,h]=(0,a.useState)(``),[g,_]=(0,a.useState)(``),[v,y]=(0,a.useState)(null),[b,x]=(0,a.useState)(!1),[S,C]=(0,a.useState)(``),w=(0,a.useRef)(null),T=(0,a.useCallback)(e=>{let t=e.target.files?.[0];if(!t)return;if(![`image/jpeg`,`image/png`,`image/webp`].includes(t.type)){_(`请上传 JPG、PNG 或 WebP 格式的图片`),y(null);return}C(t.name),_(``),h(``);let n=new FileReader;n.onload=e=>{y(e.target?.result)},n.readAsDataURL(t)},[]),E=(0,a.useCallback)(async()=>{if(!v){_(`请先上传图片`);return}x(!0),_(``),h(``);let e=[`🔍 正在预处理图片...`,`📐 正在检测文字区域...`,`🔤 正在识别文字内容...`,`✅ 识别完成`],t=``;for(let n=0;n<e.length;n++)await new Promise(e=>setTimeout(e,800)),t=e.slice(0,n+1).join(`
`),h(t);h(`====================
OCR 识别结果（演示版本）
====================

文件: ${S}
识别时间: ${new Date().toLocaleString()}
识别引擎: 演示模式

--------------------
识别内容:
--------------------
[演示数据] 图片文字识别功能需要接入 OCR 引擎。
当前为演示版本，展示了完整的交互流程。

未来集成方案:
1. 使用 tesseract.js 浏览器端 OCR
   - npm install tesseract.js
   - 支持 100+ 语言识别

2. 使用百度/腾讯云 OCR API
   - 需要 API Key 和 Secret Key
   - 识别准确率更高

3. 使用 PaddleOCR WebAssembly
   - 完全离线运行
   - 支持中英文混合识别

--------------------
如需完整功能，请选择上述方案之一进行集成。
====================`),x(!1),r(`识别完成（演示模式）`,`info`)},[v,S]);return(0,o.jsxs)(i,{toolId:`img-ocr`,title:`图片文字识别 (OCR)`,description:`上传图片，提取其中的文字内容。支持 JPG、PNG、WebP 格式`,inputValue:e,onInputChange:e=>{t(e),h(``),_(``)},outputValue:n,inputPlaceholder:`可在此输入补充说明，或直接上传图片...`,error:g,extraActions:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{style:s,onClick:()=>w.current?.click(),children:`📁 上传图片`}),(0,o.jsx)(`button`,{style:v?c:s,onClick:E,disabled:b||!v,children:b?`⏳ 识别中...`:`🔍 开始识别`})]}),children:[(0,o.jsx)(`input`,{ref:w,type:`file`,accept:`image/jpeg,image/png,image/webp`,onChange:T,style:{display:`none`}}),(0,o.jsxs)(`div`,{style:{marginBottom:16},children:[(0,o.jsx)(`div`,{style:l,children:`图片预览`}),v?(0,o.jsxs)(`div`,{style:d,children:[(0,o.jsx)(`img`,{src:v,alt:`预览`,style:f}),(0,o.jsx)(`div`,{style:{fontSize:12,color:`var(--text-muted)`,marginTop:6,fontFamily:`var(--font-sans)`},children:S})]}):(0,o.jsx)(`div`,{style:{padding:40,borderRadius:12,border:`2px dashed var(--border-color)`,textAlign:`center`,color:`var(--text-muted)`,fontSize:14,fontFamily:`var(--font-sans)`,background:`var(--bg-tool)`},children:`📷 点击上方「上传图片」按钮选择文件`})]}),(0,o.jsxs)(`div`,{style:{marginBottom:16},children:[(0,o.jsx)(`div`,{style:l,children:`集成说明`}),(0,o.jsxs)(`div`,{style:u,children:[`⚠️ 图片文字识别功能需要接入 OCR 引擎。当前为演示版本，请上传图片后点击识别按钮体验流程。`,(0,o.jsx)(`br`,{}),(0,o.jsx)(`br`,{}),(0,o.jsx)(`strong`,{children:`推荐集成方案:`}),(0,o.jsx)(`br`,{}),`1. `,(0,o.jsx)(`strong`,{children:`tesseract.js`}),` - 浏览器端 OCR，支持多语言`,(0,o.jsx)(`br`,{}),`2. `,(0,o.jsx)(`strong`,{children:`百度/腾讯云 OCR API`}),` - 高精度云端识别`,(0,o.jsx)(`br`,{}),`3. `,(0,o.jsx)(`strong`,{children:`PaddleOCR WebAssembly`}),` - 完全离线运行`]})]}),b&&(0,o.jsxs)(`div`,{style:m,children:[(0,o.jsx)(`span`,{style:{animation:`spin 1s linear infinite`,display:`inline-block`},children:`⚙️`}),`正在处理中...`]}),n&&!b&&(0,o.jsxs)(`div`,{style:{marginBottom:16},children:[(0,o.jsx)(`div`,{style:l,children:`识别结果`}),(0,o.jsx)(`div`,{style:p,children:n})]})]})}export{h as default};