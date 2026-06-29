import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };

function formatJs(code: string): string {
  let result = '';
  let indent = 0;
  const indentStr = '  ';
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    if (ch === '{') {
      result += ' {\n';
      indent++;
      i++;
      while (i < code.length && /\s/.test(code[i])) i++;
      continue;
    }
    if (ch === '}') {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd() + '\n' + indentStr.repeat(indent) + '}\n';
      i++;
      while (i < code.length && /\s/.test(code[i])) i++;
      continue;
    }
    if (ch === ';') {
      result += ';\n' + indentStr.repeat(indent);
      i++;
      while (i < code.length && /\s/.test(code[i])) i++;
      continue;
    }
    result += ch;
    i++;
  }

  return result
    .replace(/\n\s*\n/g, '\n')
    .replace(/;\s*}/g, ';\n}')
    .replace(/}\s*([^{])/g, '}\n$1')
    .trim();
}

function compressJs(code: string): string {
  // Remove single-line comments
  let result = code.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s*{\s*/g, '{');
  result = result.replace(/\s*}\s*/g, '}');
  result = result.replace(/\s*;\s*/g, ';');
  result = result.replace(/\s*\(\s*/g, '(');
  result = result.replace(/\s*\)\s*/g, ')');
  result = result.replace(/;\s*}/g, '}');
  return result.trim();
}

export default function JsFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
  };

  const format = () => {
    if (!input.trim()) return;
    setOutput(formatJs(input));
  };

  const compress = () => {
    if (!input.trim()) return;
    setOutput(compressJs(input));
  };

  const extraActions = (
    <>
      <button style={btnBase} onClick={format}>格式化</button>
      <button style={btnBase} onClick={compress}>压缩</button>
    </>
  );

  return (
    <ToolLayout
      toolId="dev-js-formatter"
      title="JavaScript代码格式化"
      description="格式化JavaScript代码，支持美化和压缩两种模式"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 JavaScript 代码..."
      extraActions={extraActions}
    />
  );
}
