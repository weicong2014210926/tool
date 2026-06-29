import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const cardGridStyle: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 };

interface Stats {
  perimeter: number;
  area: number;
  volume: number;
  surfaceArea: number;
}

export default function Rect() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);

  const calc = useCallback((l: string, w: string, h: string) => {
    const ln = parseFloat(l);
    const wn = parseFloat(w);
    const hn = parseFloat(h);

    if (isNaN(ln) || isNaN(wn) || isNaN(hn)) { setStats(null); setOutput(''); return; }
    if (ln <= 0 || wn <= 0 || hn <= 0) { setStats(null); setOutput(''); return; }

    const perimeter = 4 * (ln + wn + hn);
    const area = 2 * (ln * wn + ln * hn + wn * hn); // surface area
    const volume = ln * wn * hn;
    const baseArea = ln * wn; // area of base
    const diagonal = Math.sqrt(ln * ln + wn * wn + hn * hn);

    setStats({ perimeter, area: baseArea, volume, surfaceArea: area });
    setOutput(
      `底面周长: ${(2 * (ln + wn)).toFixed(4)}\n` +
      `底面面积: ${baseArea.toFixed(4)}\n` +
      `表面积: ${area.toFixed(4)}\n` +
      `体积: ${volume.toFixed(4)}\n` +
      `体对角线: ${diagonal.toFixed(4)}`
    );
  }, []);

  return (
    <ToolLayout
      toolId="conv-rect"
      title="矩形方体计算"
      description="计算矩形、长方体等几何形状的周长、面积、体积、表面积等属性"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>长、宽、高</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>长</div>
            <input style={{ ...inputStyle, width: 100 }} value={length} onChange={e => { setLength(e.target.value); calc(e.target.value, width, height); }} placeholder="长" type="number" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>宽</div>
            <input style={{ ...inputStyle, width: 100 }} value={width} onChange={e => { setWidth(e.target.value); calc(length, e.target.value, height); }} placeholder="宽" type="number" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>高</div>
            <input style={{ ...inputStyle, width: 100 }} value={height} onChange={e => { setHeight(e.target.value); calc(length, width, e.target.value); }} placeholder="高" type="number" />
          </div>
        </div>
      </div>

      {stats && (
        <div style={cardGridStyle}>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>底面面积</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{stats.area.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>表面积</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-blue)' }}>{stats.surfaceArea.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>体积</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-green)' }}>{stats.volume.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>棱长和</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-orange)' }}>{stats.perimeter.toFixed(2)}</div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
