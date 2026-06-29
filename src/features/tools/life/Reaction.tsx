import React, { useState, useRef, useCallback } from 'react';

const btnStyle: React.CSSProperties = { padding: '12px 24px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

type State = 'waiting' | 'ready';

const STORAGE_KEY = 'reaction_best';

export default function Reaction() {
  const [state, setState] = useState<State>('waiting');
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number>(() => {
    try { const v = localStorage.getItem(STORAGE_KEY); return v ? parseInt(v) : 0; } catch { return 0; }
  });
  const [avgTime, setAvgTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [recentTimes, setRecentTimes] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setState('waiting');
    setLastTime(null);
    const delay = Math.random() * 4000 + 1000;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'waiting') return;
    if (state === 'ready') {
      const elapsed = performance.now() - startRef.current;
      const time = Math.round(elapsed);
      setLastTime(time);
      setAttempts((a) => a + 1);
      const newRecent = [...recentTimes.slice(-4), time];
      setRecentTimes(newRecent);
      const avg = Math.round(newRecent.reduce((s, v) => s + v, 0) / newRecent.length);
      setAvgTime(avg);
      const newBest = bestTime === 0 || time < bestTime ? time : bestTime;
      if (newBest !== bestTime) {
        setBestTime(newBest);
        try { localStorage.setItem(STORAGE_KEY, String(newBest)); } catch {}
      }
      setState('waiting');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [state, bestTime, recentTimes]);

  const getBgColor = () => {
    if (state === 'ready') return '#2ecc71';
    return '#e74c3c';
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>反应速度测试</h1>
        <p style={descStyle}>测试你的反应速度。当红色变为绿色时尽快点击，记录你的反应时间</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div
          onClick={handleClick}
          style={{
            width: 220, height: 220, borderRadius: '50%', background: getBgColor(),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: state === 'ready' ? 'pointer' : 'default',
            fontSize: state === 'ready' ? 24 : 16, fontWeight: 700,
            color: '#fff', fontFamily: 'var(--font-sans)',
            transition: 'background 200ms ease',
            userSelect: 'none',
          }}
        >
          {state === 'ready' ? '点击!' : '等待中...'}
        </div>
        <button style={btnStyle} onClick={startGame}>开始测试</button>
        {lastTime !== null && (
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-mono)' }}>
            {lastTime} ms
          </div>
        )}
        <div style={{ ...cardStyle, width: '100%', maxWidth: 400 }}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>本次用时</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{lastTime !== null ? `${lastTime} ms` : '--'}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>最快记录</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#2ecc71' }}>{bestTime > 0 ? `${bestTime} ms` : '--'}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>最近5次平均</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{avgTime !== null ? `${avgTime} ms` : '--'}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>测试次数</span><span style={{ fontWeight: 600 }}>{attempts}</span></div>
        </div>
      </div>
    </div>
  );
}
