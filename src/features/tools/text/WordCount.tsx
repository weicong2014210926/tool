import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 12,
  marginBottom: 16,
};

const statCard: React.CSSProperties = {
  padding: '16px',
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
  textAlign: 'center',
};

const statValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: 'var(--color-blue)',
  fontFamily: 'var(--font-sans)',
  lineHeight: 1.2,
};

const statLabel: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  marginTop: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

interface Stats {
  totalChars: number;
  chineseChars: number;
  englishWords: number;
  lines: number;
  paragraphs: number;
  punctuation: number;
  charsNoSpaces: number;
}

export default function WordCount() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalChars: 0,
    chineseChars: 0,
    englishWords: 0,
    lines: 0,
    paragraphs: 0,
    punctuation: 0,
    charsNoSpaces: 0,
  });

  const compute = useCallback((text: string) => {
    const totalChars = text.length;
    const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const englishWords = text.trim()
      ? text
          .trim()
          .split(/\s+/)
          .filter((w) => /[a-zA-Z]/.test(w)).length
      : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim()
      ? text
          .trim()
          .split(/\n\s*\n/)
          .filter((p) => p.trim()).length
      : 0;
    const punctuation = (text.match(/[，。！？；、：“”'（）《》【】…—·,\.!\?;:'"()\[\]{}<>\-]/g) || [])
      .length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    setStats({
      totalChars,
      chineseChars,
      englishWords,
      lines,
      paragraphs,
      punctuation,
      charsNoSpaces,
    });
  }, []);

  useEffect(() => {
    compute(input);
  }, [input, compute]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  const statItems: { key: keyof Stats; label: string }[] = [
    { key: 'totalChars', label: '总字符数' },
    { key: 'chineseChars', label: '中文字符' },
    { key: 'englishWords', label: '英文单词数' },
    { key: 'lines', label: '行数' },
    { key: 'paragraphs', label: '段落数' },
    { key: 'punctuation', label: '标点符号' },
    { key: 'charsNoSpaces', label: '不含空格字符数' },
  ];

  return (
    <ToolLayout
      toolId="text-word-count"
      title="字数统计工具"
      description="统计文本中的字数、字符数、段落数、行数、中英文字数等详细统计信息"
      inputValue={input}
      onInputChange={handleInput}
      outputValue=""
      inputPlaceholder="在此粘贴文本内容..."
    >
      <div style={statsGrid}>
        {statItems.map((item) => (
          <div key={item.key} style={statCard}>
            <div style={statValue}>{stats[item.key]}</div>
            <div style={statLabel}>{item.label}</div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
