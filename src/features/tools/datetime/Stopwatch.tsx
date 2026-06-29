import React, { useState, useRef, useEffect, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const btnDanger: React.CSSProperties = { ...btnStyle, background: 'var(--color-red)', color: '#fff', borderColor: 'var(--color-red)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const timeStyle: React.CSSProperties = { fontSize: 48, fontWeight: 800, fontFamily: '"Fira Code", monospace', color: 'var(--text-primary)', textAlign: 'center', padding: '20px 0' };
const lapStyle: React.CSSProperties = { fontSize: 13, fontFamily: '"Fira Code", monospace', color: 'var(--text-secondary)', padding: '6px 12px', borderBottom: '1px solid var(--border-light)' };

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0); // ms
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startPause = useCallback(() => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      elapsedRef.current += Date.now() - startRef.current;
      setRunning(false);
    } else {
      startRef.current = Date.now();
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(elapsedRef.current + Date.now() - startRef.current);
      }, 10);
    }
  }, [running]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
    setLaps([]);
    elapsedRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    const t = elapsedRef.current + (running ? Date.now() - startRef.current : 0);
    setLaps(prev => [t, ...prev]);
  }, [running]);

  const fmt = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const centi = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(centi).padStart(2, '0')}`;
  };

  return (
    <ToolLayout
      toolId="date-stopwatch"
      title="在线秒表"
      description="提供在线秒表计时功能，支持开始、暂停、计次和复位操作"
      hideInput
      outputValue=""
    >
      <div style={timeStyle}>{fmt(time)}</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        <button style={running ? btnDanger : btnPrimary} onClick={startPause}>
          {running ? '暂停' : '开始'}
        </button>
        <button style={btnStyle} onClick={lap} disabled={!running && time === 0}>计次</button>
        <button style={btnStyle} onClick={reset}>复位</button>
      </div>
      {laps.length > 0 && (
        <div>
          <div style={labelStyle}>计次列表</div>
          {laps.map((l, i) => (
            <div key={i} style={lapStyle}>
              #{laps.length - i}: {fmt(l)}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
