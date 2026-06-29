import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

function textToHtml(text: string): string {
  if (!text.trim()) return '';
  const blocks = text.split(/\n\s*\n/);
  const htmlBlocks: string[] = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    // Check if block looks like a bullet list
    const isList = lines.every((l) => /^[-*]\s+/.test(l));
    if (isList && lines.length > 0) {
      const items = lines.map((l) => `  <li>${l.replace(/^[-*]\s+/, '')}</li>`).join('\n');
      htmlBlocks.push('<ul>\n' + items + '\n</ul>');
    } else {
      const content = lines.join('<br>\n');
      htmlBlocks.push(`<p>${content}</p>`);
    }
  }
  return htmlBlocks.join('\n');
}

export default function ToHtml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback(() => {
    setOutput(textToHtml(input));
  }, [input]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  const extraActions = (
    <button
      style={{
        padding: '8px 20px', borderRadius: 12,
        border: '1px solid var(--border-color)',
        background: 'var(--color-teal)', color: '#fff',
        fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
        cursor: 'pointer', boxShadow: '0 2px 0 #5aab8a',
        transition: 'all 150ms ease',
      }}
      onClick={convert}
    >
      转换
    </button>
  );

  return (
    <ToolLayout
      toolId="text-to-html"
      title="文本转HTML工具"
      description="将纯文本转换为HTML格式，支持段落、换行和列表转换"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴纯文本，将自动转换为HTML..."
      extraActions={extraActions}
    />
  );
}
