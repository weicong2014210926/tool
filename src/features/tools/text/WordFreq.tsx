import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const controlBar: React.CSSProperties = {
  display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
  marginBottom: 16, padding: '12px 16px', borderRadius: 12,
  background: 'var(--bg-tool)', border: '1px solid var(--border-light)',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)',
  background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13,
  fontFamily: 'var(--font-sans)', outline: 'none', width: 80,
};

const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 13,
  fontFamily: 'var(--font-sans)',
};

const thStyle: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', fontWeight: 700,
  color: 'var(--text-muted)', borderBottom: '2px solid var(--border-color)',
  fontSize: 12, textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '6px 12px', borderBottom: '1px solid var(--border-light)',
  color: 'var(--text-primary)',
};

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','shall','should',
  'may','might','must','can','could','i','me','my','we','our','us',
  'you','your','he','him','his','she','her','it','its','they','them',
  'their','this','that','these','those','to','of','in','for','on',
  'with','at','by','from','as','or','and','not','no','but','if',
  'so','than','too','very','just','about','also','into','up','out',
  '的','了','在','是','我','有','和','就','不','人','都','一','一个',
  '上','也','很','到','说','要','去','你','会','着','没','看','好','自己','这',
]);

function extractWords(text: string, minLen: number, filterStop: boolean): Map<string, number> {
  const freq = new Map<string, number>();
  const chineseChars = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]+/g);
  if (chineseChars) {
    for (const chunk of chineseChars) {
      for (let i = 0; i < chunk.length - 1; i++) {
        const bigram = chunk.substring(i, i + 2);
        freq.set(bigram, (freq.get(bigram) || 0) + 1);
      }
    }
  }
  const englishWords = text.match(/[a-zA-Z]+/g);
  if (englishWords) {
    for (const w of englishWords) {
      const lower = w.toLowerCase();
      if (lower.length >= minLen) {
        if (filterStop && STOP_WORDS.has(lower)) continue;
        freq.set(lower, (freq.get(lower) || 0) + 1);
      }
    }
  }
  return freq;
}

export default function WordFreq() {
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState('2');
  const [topN, setTopN] = useState('50');
  const [filterStopwords, setFilterStopwords] = useState(true);
  const [freqData, setFreqData] = useState<{ word: string; count: number; pct: string }[]>([]);

  const compute = useCallback(() => {
    if (!input.trim()) { setFreqData([]); return; }
    const minLen = parseInt(minLength, 10) || 1;
    const top = parseInt(topN, 10) || 50;
    const freq = extractWords(input, minLen, filterStopwords);
    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
    const total = sorted.reduce((s, [, c]) => s + c, 0);
    setFreqData(sorted.map(([word, count]) => ({
      word, count,
      pct: total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0%',
    })));
  }, [input, minLength, topN, filterStopwords]);

  useEffect(() => { compute(); }, [compute]);

  return (
    <ToolLayout
      toolId="text-word-freq"
      title="词频统计工具"
      description="分析文本中词语出现的频率，支持中文分词和词频排序展示"
      inputValue={input}
      onInputChange={setInput}
      outputValue=""
      inputPlaceholder="在此粘贴文本进行词频分析..."
    >
      <div style={controlBar}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
          最小词长
        </span>
        <input type="number" style={inputStyle} value={minLength}
          onChange={(e) => setMinLength(e.target.value)} min="1" />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
          前 N 个
        </span>
        <input type="number" style={inputStyle} value={topN}
          onChange={(e) => setTopN(e.target.value)} min="1" max="500" />
        <label style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={filterStopwords}
            onChange={() => setFilterStopwords(!filterStopwords)} />
          过滤停用词
        </label>
      </div>
      {freqData.length > 0 && (
        <div style={{ marginBottom: 16, overflow: 'auto', maxHeight: 400 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>词</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>频率</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>占比</th>
              </tr>
            </thead>
            <tbody>
              {freqData.map((item, idx) => (
                <tr key={item.word}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={tdStyle}>{item.word}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.count}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
