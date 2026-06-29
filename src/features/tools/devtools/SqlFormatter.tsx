import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'ON',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET',
  'UNION', 'ALL', 'AS', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'ASC', 'DESC', 'NULL', 'IS', 'EXISTS', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'CONSTRAINT',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
]);

const NEWLINE_BEFORE = new Set(['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'ON', 'ORDER', 'GROUP', 'HAVING', 'LIMIT', 'UNION', 'INSERT', 'VALUES', 'UPDATE', 'DELETE', 'SET', 'CREATE', 'ALTER', 'DROP']);

function formatSql(code: string): string {
  let result = '';
  const tokens = code
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/\b/)
    .filter(t => t.trim());
  
  let indent = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;
    
    const upper = token.toUpperCase();
    
    if (upper === '(') {
      result += '( ';
      continue;
    }
    if (upper === ')') {
      result = result.trimEnd() + ' ) ';
      continue;
    }
    if (upper === ',') {
      result = result.trimEnd() + ', ';
      continue;
    }
    
    if (NEWLINE_BEFORE.has(upper)) {
      let prefix = '\n' + '  '.repeat(Math.max(0, indent));
      if (upper === 'JOIN' || upper === 'INNER' || upper === 'LEFT' || upper === 'RIGHT' || upper === 'OUTER' || upper === 'CROSS') {
        prefix = '\n' + '  '.repeat(Math.max(0, indent));
        // reset indent for join chain
      } else if (upper === 'ON') {
        prefix = '\n' + '  '.repeat(Math.max(0, indent));
      } else if (upper === 'AND' || upper === 'OR') {
        prefix = '\n' + '  '.repeat(Math.max(0, indent));
      }
      result += prefix + (KEYWORDS.has(upper) ? upper : token);
    } else {
      result += (result.length > 0 && !result.endsWith('\n') && !result.endsWith(' ') ? ' ' : '') + (KEYWORDS.has(upper) ? upper : token);
    }
  }
  
  return result.replace(/\n\s*\n/g, '\n').trim();
}

function compressSql(code: string): string {
  return code.replace(/\s+/g, ' ').trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
  };

  const format = () => {
    if (!input.trim()) return;
    setOutput(formatSql(input));
  };

  const compress = () => {
    if (!input.trim()) return;
    setOutput(compressSql(input));
  };

  const extraActions = (
    <>
      <button style={btnBase} onClick={format}>格式化</button>
      <button style={btnBase} onClick={compress}>压缩</button>
    </>
  );

  return (
    <ToolLayout
      toolId="dev-sql-formatter"
      title="SQL格式化压缩"
      description="格式化SQL语句，支持美化和压缩，自动大写关键字"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 SQL 语句..."
      extraActions={extraActions}
    />
  );
}
