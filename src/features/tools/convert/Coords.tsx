import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '16px 20px', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const PI = Math.PI;
const X_PI = PI * 3000.0 / 180.0;
const A = 6378245.0;
const EE = 0.00669342162296594323;

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

// WGS84 -> GCJ02
function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  const dLat = transformLat(lng - 105.0, lat - 35.0);
  const dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  const dLatFinal = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
  const dLngFinal = (dLng * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI);
  return [lng + dLngFinal, lat + dLatFinal];
}

// GCJ02 -> WGS84
function gcj02ToWgs84(lng: number, lat: number): [number, number] {
  const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat);
  return [lng * 2 - gcjLng, lat * 2 - gcjLat];
}

// GCJ02 -> BD09
function gcj02ToBd09(lng: number, lat: number): [number, number] {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006];
}

// BD09 -> GCJ02
function bd09ToGcj02(lng: number, lat: number): [number, number] {
  const x = lng - 0.0065, y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  return [z * Math.cos(theta), z * Math.sin(theta)];
}

const systems = ['WGS84', 'GCJ02', 'BD09'];

export default function Coords() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [from, setFrom] = useState('WGS84');
  const [to, setTo] = useState('GCJ02');
  const [output, setOutput] = useState('');
  const [result, setResult] = useState<{ lat: number; lng: number } | null>(null);

  const convert = useCallback(() => {
    if (!lat || !lng) { setOutput('请输入经纬度'); return; }
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    if (isNaN(la) || isNaN(ln)) { setOutput('无效的经纬度'); return; }
    if (la < -90 || la > 90 || ln < -180 || ln > 180) { setOutput('纬度范围-90~90，经度范围-180~180'); return; }

    let [resultLng, resultLat] = [ln, la];

    // Route through GCJ02 as intermediate if needed
    if (from === 'WGS84' && to === 'GCJ02') {
      [resultLng, resultLat] = wgs84ToGcj02(ln, la);
    } else if (from === 'GCJ02' && to === 'WGS84') {
      [resultLng, resultLat] = gcj02ToWgs84(ln, la);
    } else if (from === 'GCJ02' && to === 'BD09') {
      [resultLng, resultLat] = gcj02ToBd09(ln, la);
    } else if (from === 'BD09' && to === 'GCJ02') {
      [resultLng, resultLat] = bd09ToGcj02(ln, la);
    } else if (from === 'WGS84' && to === 'BD09') {
      const [gl, ga] = wgs84ToGcj02(ln, la);
      [resultLng, resultLat] = gcj02ToBd09(gl, ga);
    } else if (from === 'BD09' && to === 'WGS84') {
      const [gl, ga] = bd09ToGcj02(ln, la);
      [resultLng, resultLat] = gcj02ToWgs84(gl, ga);
    }

    setResult({ lat: resultLat, lng: resultLng });
    setOutput(`${to}: ${resultLat.toFixed(6)}, ${resultLng.toFixed(6)}`);
  }, [lat, lng, from, to]);

  return (
    <ToolLayout
      toolId="conv-coords"
      title="地理坐标系转换"
      description="在WGS84、GCJ02、BD09坐标系之间进行经纬度转换"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>经纬度</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>纬度</div>
            <input style={{ ...inputStyle, width: 150 }} value={lat} onChange={e => setLat(e.target.value)} placeholder="39.9042" type="number" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>经度</div>
            <input style={{ ...inputStyle, width: 150 }} value={lng} onChange={e => setLng(e.target.value)} placeholder="116.4074" type="number" />
          </div>
        </div>
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>坐标系转换</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={from} onChange={e => setFrom(e.target.value)}>
            {systems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => setTo(e.target.value)}>
            {systems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button style={btnStyle} onClick={convert}>转换</button>
        </div>
      </div>
      {result && (
        <div style={resultStyle}>
          {to}: {result.lat.toFixed(6)}, {result.lng.toFixed(6)}
        </div>
      )}
    </ToolLayout>
  );
}
