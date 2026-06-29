import React, { useState, useCallback } from 'react';
import { showToast } from '../../../components/ui/Toast';

const categories: Record<string, string[]> = {
  '数学符号': ['\u00b1','\u00d7','\u00f7','\u221a','\u221e','\u2248','\u2260','\u2264','\u2265','\u2220','\u222b','\u2211','\u2200','\u2203','\u2208','\u2209','\u2282','\u2283','\u2229','\u222a','\u2234','\u2235','\u2236','\u2237','\u2261','\u2262','\u221d','\u222e','\u221f','\u222c'],
  '单位符号': ['\u00b0','\u2032','\u2033','\u00b5','\u2126','\u00b1','\u2030','\u2116','\u00b9','\u00b2','\u00b3','\u2103','\u2109','\u2109','\u2127','\u00a3','\u00a5','\u20ac','\u20bd','\u20b9','\u20a9','\u20a4','\u20a6','\u20a8'],
  '箭头符号': ['\u2190','\u2191','\u2192','\u2193','\u2194','\u2195','\u21b5','\u21a6','\u2196','\u2197','\u2198','\u2199','\u21d2','\u21d0','\u21d1','\u21d3','\u21d4','\u21c4','\u21c5','\u27f0','\u27f1','\u2934','\u2935','\u2b06','\u2b07','\u2b05','\u27a1'],
  '装饰符号': ['\u2600','\u2601','\u2602','\u2603','\u260e','\u2615','\u263a','\u263b','\u2660','\u2661','\u2662','\u2663','\u2665','\u2666','\u266b','\u2713','\u2714','\u2717','\u2718','\u273f','\u2744','\u2764','\u2b50','\u2605','\u2606','\u262f','\u263c','\u264f'],
  '括号符号': ['( )','[ ]','{ }','\u300a ','\u300b','\u300c','\u300d','\u300e','\u300f','\u3010','\u3011','\u3014','\u3015','\u3016','\u3017','\u2308','\u2309','\u230a','\u230b','\u27e6','\u27e7','\u27e8','\u27e9','\u27ea','\u27eb','\u27ec','\u27ed'],
  '货币符号': ['\u00a3','\u00a5','\u20ac','\u20bd','\u20b9','\u20a9','\u20a4','\u20a6','\u20a8','\u5143','\u20b1','\u00a2','\u20a1','\u20b2','\u20a7'],
  '希腊字母': ['\u0391','\u0392','\u0393','\u0394','\u0395','\u0396','\u0397','\u0398','\u0399','\u039a','\u039b','\u039c','\u039d','\u039e','\u039f','\u03a0','\u03a1','\u03a3','\u03a4','\u03a5','\u03a6','\u03a7','\u03a8','\u03a9','\u03b1','\u03b2','\u03b3','\u03b4','\u03b5','\u03b6','\u03b7','\u03b8','\u03b9','\u03ba','\u03bb','\u03bc','\u03bd','\u03be','\u03bf','\u03c0','\u03c1','\u03c2','\u03c3','\u03c4','\u03c5','\u03c6','\u03c7','\u03c8','\u03c9'],
  '特殊符号': ['\u00a9','\u00ae','\u2122','\u00b6','\u00a7','\u2020','\u2021','\u00b0','\u00a0','\u2002','\u2003','\u2009','\u200a','\u200b','\u2022','\u25aa','\u25ab','\u25e6','\u2043','\u25cb','\u25cf','\u25c6','\u25b6','\u25c0','\u25a0','\u25cf','\u3001','\u3002','\u00b7','\u2605','\u2606'],
};

const pageStyle: React.CSSProperties = {
  maxWidth: 900, margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28, fontWeight: 800, color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)', marginBottom: 8,
};

const descStyle: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6,
};

const searchStyle: React.CSSProperties = {
  width: '100%', padding: '10px 16px', borderRadius: 12,
  border: '1px solid var(--border-color)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)',
  outline: 'none', marginBottom: 20,
};

const catTitleStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)', marginBottom: 8, marginTop: 16,
  textTransform: 'uppercase',
};

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
  gap: 6, marginBottom: 12,
};

const symbolBtn: React.CSSProperties = {
  padding: '8px 4px', borderRadius: 8, border: '1px solid var(--border-light)',
  background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 18,
  cursor: 'pointer', fontFamily: 'var(--font-sans)',
  transition: 'all 150ms ease', textAlign: 'center', minWidth: 48,
};

export default function SpecialSymbols() {
  const [search, setSearch] = useState('');
  const searchLower = search.toLowerCase();

  const copySymbol = useCallback(async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      showToast(`已复制: ${symbol}`, 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  }, []);

  const filtered = Object.entries(categories).reduce<Record<string, string[]>>((acc, [cat, syms]) => {
    if (!searchLower) { acc[cat] = syms; return acc; }
    const filtered = syms.filter((s) => s.toLowerCase().includes(searchLower) || cat.toLowerCase().includes(searchLower));
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>特殊符号大全</h1>
        <p style={descStyle}>提供数学符号、单位符号、标点符号、特殊字符等各类符号的快速复制</p>
      </div>
      <input
        style={searchStyle}
        placeholder="搜索符号..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {Object.entries(filtered).map(([cat, syms]) => (
        <div key={cat}>
          <div style={catTitleStyle}>{cat}</div>
          <div style={gridStyle}>
            {syms.map((s, i) => (
              <button key={i} style={symbolBtn}
                onClick={() => copySymbol(s)}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--color-blue)'; (e.target as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'var(--bg-card)'; (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
