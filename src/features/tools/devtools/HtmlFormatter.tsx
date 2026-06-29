import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };

function formatHtml(code: string): string {
  let result = '';
  let indent = 0;
  const indentStr = '  ';
  const selfClosing = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
  let i = 0;

  while (i < code.length) {
    if (code[i] === '<') {
      const end = code.indexOf('>', i);
      if (end === -1) {
        result += code.substring(i);
        break;
      }
      let tag = code.substring(i + 1, end).trim();

      if (tag.startsWith('/')) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        result = result.trimEnd() + '\n' + indentStr.repeat(indent) + '<' + tag + '>';
        i = end + 1;
        while (i < code.length && /\s/.test(code[i])) i++;
        if (i < code.length && code[i] !== '<') {
          result += '\n' + indentStr.repeat(indent);
        }
        continue;
      }

      const tagName = tag.split(/\s/)[0].toLowerCase();
      const isSelfClosing = selfClosing.has(tagName) || tag.endsWith('/');

      result += '\n' + indentStr.repeat(indent) + '<' + tag + '>';

      if (!isSelfClosing) {
        indent++;
      }
      i = end + 1;
      while (i < code.length && /\s/.test(code[i])) i++;
      continue;
    }
    // Text content
    const nextTag = code.indexOf('<', i);
    if (nextTag === -1) {
      result += code.substring(i).trim();
      break;
    }
    const text = code.substring(i, nextTag).trim();
    if (text) {
      text.split('\n').forEach((line, li) => {
        if (line.trim()) {
          result += '\n' + indentStr.repeat(indent) + line.trim();
        }
      });
    }
    i = nextTag;
  }

  return result.trim();
}

function compressHtml(code: string): string {
  return code
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .trim();
}

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
  };

  const format = () => {
    if (!input.trim()) return;
    setOutput(formatHtml(input));
  };

  const compress = () => {
    if (!input.trim()) return;
    setOutput(compressHtml(input));
  };

  const extraActions = (
    <>
      <button style={btnBase} onClick={format}>格式化</button>
      <button style={btnBase} onClick={compress}>压缩</button>
    </>
  );

  return (
    <ToolLayout
      toolId="dev-html-formatter"
      title="HTML格式化工具"
      description="格式化HTML代码，支持缩进调整和压缩"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 HTML 代码..."
      extraActions={extraActions}
    />
  );
}
