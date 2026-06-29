import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 6 };

function typeForValue(value: any, key?: string): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    const itemTypes = value.map(v => typeForValue(v));
    const unique = [...new Set(itemTypes)];
    if (unique.length === 1) return unique[0] + '[]';
    return '(' + unique.join(' | ') + ')[]';
  }
  if (typeof value === 'object') {
    return generateInterface(value);
  }
  return typeof value;
}

let interfaceIndex = 0;
function generateInterface(obj: Record<string, any>): string {
  if (typeof obj !== 'object' || obj === null) return 'any';
  const lines: string[] = ['{'];
  for (const [key, value] of Object.entries(obj)) {
    const optional = value === null || value === undefined;
    const type = typeForValue(value, key);
    lines.push(`  ${key}${optional ? '?' : ''}: ${type};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function generateTs(input: string): string {
  interfaceIndex = 0;
  try {
    const obj = JSON.parse(input);
    if (Array.isArray(obj)) {
      const type = typeForValue(obj);
      return `type RootType = ${type};\n\nexport default RootType;`;
    }
    const type = generateInterface(obj);
    const inline = type.replace('{', '{\n').replace('}', '\n}');    
    return `interface RootType {\n${type.slice(1, -1).trim()}\n}\n\nexport default RootType;`;
  } catch (e: any) {
    return `// JSON 解析错误: ${e.message}`;
  }
}

export default function JsonToTs() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
    setError('');
  };

  const generate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input); // validate
      const ts = generateTs(input);
      setOutput(ts);
      setError('');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
    }
  };

  const extraActions = (
    <button style={btnBase} onClick={generate}>生成 TypeScript 类型</button>
  );

  return (
    <ToolLayout
      toolId="dev-json-to-ts"
      title="JSON转TypeScript类型"
      description="将JSON数据自动转换为TypeScript类型定义，提升开发效率"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 JSON 数据..."
      error={error}
      extraActions={extraActions}
    />
  );
}
