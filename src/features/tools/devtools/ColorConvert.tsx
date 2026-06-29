import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", monospace', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 16 };
const colorBox: React.CSSProperties = { width: 60, height: 40, borderRadius: 8, border: '1px solid var(--border-color)' };
const resultItem: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 };

interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  r: number;
  g: number;
  b: number;
}

function parseColor(input: string): ColorResult | null {
  let r = 0, g = 0, b = 0;
  const s = input.trim();
  
  // Hex
  if (s.startsWith('#')) {
    const hex = s.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return null;
    }
  }
  // rgb/rgba
  else if (s.startsWith('rgb')) {
    const match = s.match(/[\d.]+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    } else return null;
  }
  // hsl
  else if (s.startsWith('hsl')) {
    const match = s.match(/[\d.]+/g);
    if (match && match.length >= 3) {
      const h = parseFloat(match[0]) / 360;
      const sl = parseFloat(match[1]) / 100;
      const ll = parseFloat(match[2]) / 100;
      const [hr, hg, hb] = hslToRgb(h, sl, ll);
      r = hr; g = hg; b = hb;
    } else return null;
  } else {
    return null;
  }
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  const [h, sl, l] = rgbToHsl(r, g, b);
  const [hv, sv, v] = rgbToHsv(r, g, b);
  
  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(sl * 100)}%, ${Math.round(l * 100)}%)`,
    hsv: `hsv(${Math.round(hv * 360)}, ${Math.round(sv * 100)}%, ${Math.round(v * 100)}%)`,
    r, g, b,
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h, s, l];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = max === 0 ? 0 : (max - min) / max, v = max;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h, s, v];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function ColorConvert() {
  const [input, setInput] = useState('');
  const [hexInput, setHexInput] = useState('');

  const color = useMemo(() => {
    const val = input.trim() || hexInput.trim();
    if (!val) return null;
    return parseColor(val);
  }, [input, hexInput]);

  const handleHexChange = (v: string) => {
    setHexInput(v);
    if (v.trim()) setInput('');
  };

  const handleInputChange = (v: string) => {
    setInput(v);
    if (v.trim()) setHexInput('');
  };

  return (
    <ToolLayout
      toolId="dev-color-convert"
      title="颜色值转换"
      description="在HEX、RGB、HSL、HSV等颜色格式之间进行转换，支持颜色预览"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入颜色值</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={input}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="如 #ff0000, rgb(255,0,0), hsl(0,100%,50%)"
        />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>或使用颜色选择器</div>
        <input
          type="color"
          value={hexInput || '#000000'}
          onChange={e => handleHexChange(e.target.value)}
          style={{ width: 60, height: 40, cursor: 'pointer' }}
        />
      </div>

      {color && (
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ ...colorBox, background: color.hex }}></div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>颜色预览</span>
          </div>
          {[
            { label: 'HEX', value: color.hex },
            { label: 'RGB', value: color.rgb },
            { label: 'HSL', value: color.hsl },
            { label: 'HSV', value: color.hsv },
          ].map((f, i) => (
            <div key={i} style={resultItem}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>{f.label}</span>
              <span style={{ fontFamily: '"Fira Code", monospace', color: 'var(--text-primary)', fontSize: 13 }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
