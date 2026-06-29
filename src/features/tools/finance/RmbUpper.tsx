import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px 24px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)', wordBreak: 'break-word' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, fontFamily: 'var(--font-sans)', marginTop: 6 };

const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const cnIntUnits = ['', '拾', '佰', '仟'];
const cnBigUnits = ['', '万', '亿', '兆'];
const cnDecUnits = ['角', '分'];

function integerToChinese(num: string): string {
  if (num === '0') return cnNums[0];
  
  const segments: string[] = [];
  let pos = num.length;
  
  while (pos > 0) {
    const start = Math.max(0, pos - 4);
    segments.unshift(num.slice(start, pos));
    pos = start;
  }
  
  let result = '';
  let needZero = false;
  
  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    const seg = segments[segIdx];
    const unitPos = segments.length - 1 - segIdx;
    let segStr = '';
    let segNeedZero = false;
    
    for (let i = 0; i < seg.length; i++) {
      const digit = parseInt(seg[i]);
      const place = seg.length - 1 - i;
      
      if (digit === 0) {
        segNeedZero = true;
      } else {
        if (segNeedZero) {
          segStr += cnNums[0];
          segNeedZero = false;
        }
        segStr += cnNums[digit] + cnIntUnits[place];
      }
    }
    
    // Prepend 零 from previous segment if needed
    if (needZero && segStr) {
      result += cnNums[0];
      needZero = false;
    }
    
    if (segStr) {
      result += segStr + cnBigUnits[unitPos];
    } else if (unitPos > 0) {
      // All zeros in this segment, but still need to mark the unit if prev has content
      if (result) {
        needZero = true;
        // For consecutive all-zero segments, don't repeat 零
        if (!result.endsWith(cnNums[0]) && !result.endsWith(cnBigUnits[unitPos])) {
          result += cnNums[0];
        }
      }
    }
  }
  
  // Clean up: remove trailing 零 followed by a big unit unless preceded by content
  result = result.replace(/零+$/, '');
  
  return result || cnNums[0];
}

export default function RmbUpper() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const { output, displayNum } = useMemo(() => {
    if (!input.trim()) return { output: '', displayNum: '' };
    
    const cleaned = input.replace(/[^\d.]/g, '');
    if (!cleaned) return { output: '', displayNum: '' };
    
    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) {
      setError('请输入有效的正数金额');
      return { output: '', displayNum: '' };
    }
    if (num > 99999999999999.99) {
      setError('金额过大，超出支持范围');
      return { output: '', displayNum: '' };
    }
    setError('');
    
    // Format number with commas
    const fmt = num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Integer part
    const integerPart = Math.floor(num);
    const intStr = integerToChinese(String(integerPart));
    
    // Decimal part
    const decStr = (Math.round(num * 100) % 100).toString().padStart(2, '0');
    const jiao = parseInt(decStr[0]);
    const fen = parseInt(decStr[1]);
    
    let result = intStr + '元';
    if (jiao === 0 && fen === 0) {
      result += '整';
    } else {
      if (jiao > 0) result += cnNums[jiao] + '角';
      if (fen > 0) {
        if (jiao === 0) result += '零';
        result += cnNums[fen] + '分';
      }
    }
    
    return { output: result, displayNum: fmt };
  }, [input]);

  return (
    <ToolLayout
      toolId="fin-rmb-upper"
      title="人民币大写转换"
      description="将阿拉伯数字金额转换为人民币大写金额格式，符合银行和财务规范"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入金额（元）</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入数字金额，例如：1234.56 或 10000000"
          type="text"
          inputMode="decimal"
        />
        {displayNum && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            输入金额：{displayNum} 元
          </div>
        )}
        {error && <div style={errorStyle}>{error}</div>}
      </div>
      {output && <div style={resultStyle}>{output}</div>}
    </ToolLayout>
  );
}
