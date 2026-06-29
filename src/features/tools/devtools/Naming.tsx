import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: '"Fira Code", monospace' };
const thStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)' };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

function camelCase(s: string): string {
  return s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

function pascalCase(s: string): string {
  const c = camelCase(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function snakeCase(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/[-_\s]+/g, '_').replace(/^_/, '');
}

function upperSnake(s: string): string {
  return snakeCase(s).toUpperCase();
}

function kebabCase(s: string): string {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/[-_\s]+/g, '-').replace(/^-/, '');
}

function constantCase(s: string): string {
  return upperSnake(s);
}

function dotCase(s: string): string {
  return lowerCase(s).replace(/\s+/g, '.');
}

function pathCase(s: string): string {
  return lowerCase(s).replace(/\s+/g, '/');
}

function lowerCase(s: string): string {
  return s.toLowerCase().replace(/[-_]+/g, ' ');
}

function spaceCase(s: string): string {
  return s.replace(/([A-Z])/g, ' $1').replace(/[-_]+/g, ' ').trim();
}

const formats: { name: string; fn: (s: string) => string }[] = [
  { name: 'camelCase', fn: camelCase },
  { name: 'PascalCase', fn: pascalCase },
  { name: 'snake_case', fn: snakeCase },
  { name: 'UPPER_SNAKE', fn: upperSnake },
  { name: 'kebab-case', fn: kebabCase },
  { name: 'CONSTANT_CASE', fn: constantCase },
  { name: 'dot.case', fn: dotCase },
  { name: 'path/case', fn: pathCase },
  { name: 'lower case', fn: lowerCase },
  { name: 'space case', fn: spaceCase },
];

export default function Naming() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      return;
    }
    const rows = formats.map(f => ({ format: f.name, result: f.fn(value) }));
    setOutput(JSON.stringify(rows));
  }, []);

  let results: { format: string; result: string }[] = [];
  try { if (output) results = JSON.parse(output); } catch {}

  return (
    <ToolLayout
      toolId="dev-naming"
      title="命名转换器"
      description="在驼峰命名、下划线命名、中划线命名等10种命名风格间转换"
      inputValue={input}
      onInputChange={handleInput}
      outputValue=""
      inputPlaceholder="输入要转换的文本，如 'my-variable_name'..."
    >
      {results.length > 0 && (
        <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 16 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>命名风格</th>
                <th style={thStyle}>转换结果</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-secondary)' }}>{r.format}</td>
                  <td style={{ ...tdStyle, fontFamily: '"Fira Code", monospace' }}>{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
