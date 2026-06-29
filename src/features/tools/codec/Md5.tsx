import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

/* ---- Pure JS MD5 implementation ---- */
function md5(message: string): string {
  function rotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number): number {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const result = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return result ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ lX8 ^ lY8;
      return result ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return result ^ lX8 ^ lY8;
  }

  function F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z; }
  function I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string): number[] {
    const len = str.length;
    const wordArray: number[] = [];
    for (let i = 0; i < len - 3; i += 4) {
      wordArray.push(
        (str.charCodeAt(i) & 0xff) |
        ((str.charCodeAt(i + 1) & 0xff) << 8) |
        ((str.charCodeAt(i + 2) & 0xff) << 16) |
        ((str.charCodeAt(i + 3) & 0xff) << 24)
      );
    }
    const remainder = len % 4;
    if (remainder > 0) {
      let w = 0;
      for (let i = len - remainder; i < len; i++) {
        w |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
      }
      wordArray.push(w);
    }
    return wordArray;
  }

  function wordToHex(lValue: number): string {
    let hex = '';
    for (let i = 0; i <= 3; i++) {
      const b = (lValue >>> (i * 8)) & 0xff;
      hex += (b < 16 ? '0' : '') + b.toString(16);
    }
    return hex;
  }

  const x = convertToWordArray(message);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const originalLength = message.length;
  x[originalLength >> 2] |= 0x80 << ((originalLength % 4) * 8);
  const newLen = (((originalLength + 8) >>> 6) + 1) * 16;
  x.length = newLen;
  x[newLen - 2] = (originalLength * 8) & 0xffffffff;
  x[newLen - 1] = ((originalLength * 8) >>> 32) & 0xffffffff;

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a, oldB = b, oldC = c, oldD = d;
    a = FF(a, b, c, d, x[i + 0], 7, 0xd76aa478);
    d = FF(d, a, b, c, x[i + 1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[i + 2], 17, 0x242070db);
    b = FF(b, c, d, a, x[i + 3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[i + 4], 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[i + 5], 12, 0x4787c62a);
    c = FF(c, d, a, b, x[i + 6], 17, 0xa8304613);
    b = FF(b, c, d, a, x[i + 7], 22, 0xfd469501);
    a = FF(a, b, c, d, x[i + 8], 7, 0x698098d8);
    d = FF(d, a, b, c, x[i + 9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[i + 10], 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[i + 11], 22, 0x895cd7be);
    a = FF(a, b, c, d, x[i + 12], 7, 0x6b901122);
    d = FF(d, a, b, c, x[i + 13], 12, 0xfd987193);
    c = FF(c, d, a, b, x[i + 14], 17, 0xa679438e);
    b = FF(b, c, d, a, x[i + 15], 22, 0x49b40821);

    a = GG(a, b, c, d, x[i + 1], 5, 0xf61e2562);
    d = GG(d, a, b, c, x[i + 6], 9, 0xc040b340);
    c = GG(c, d, a, b, x[i + 11], 14, 0x265e5a51);
    b = GG(b, c, d, a, x[i + 0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[i + 5], 5, 0xd62f105d);
    d = GG(d, a, b, c, x[i + 10], 9, 0x02441453);
    c = GG(c, d, a, b, x[i + 15], 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[i + 4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[i + 9], 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[i + 14], 9, 0xc33707d6);
    c = GG(c, d, a, b, x[i + 3], 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[i + 8], 20, 0x455a14ed);
    a = GG(a, b, c, d, x[i + 13], 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[i + 2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[i + 7], 14, 0x676f02d9);
    b = GG(b, c, d, a, x[i + 12], 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[i + 5], 4, 0xfffa3942);
    d = HH(d, a, b, c, x[i + 8], 11, 0x8771f681);
    c = HH(c, d, a, b, x[i + 11], 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[i + 14], 23, 0xfde5380c);
    a = HH(a, b, c, d, x[i + 1], 4, 0xa4beea44);
    d = HH(d, a, b, c, x[i + 4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[i + 7], 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[i + 10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[i + 13], 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[i + 0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[i + 3], 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[i + 6], 23, 0x04881d05);
    a = HH(a, b, c, d, x[i + 9], 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[i + 12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[i + 15], 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[i + 2], 23, 0xc4ac5665);

    a = II(a, b, c, d, x[i + 0], 6, 0xf4292244);
    d = II(d, a, b, c, x[i + 7], 10, 0x432aff97);
    c = II(c, d, a, b, x[i + 14], 15, 0xab9423a7);
    b = II(b, c, d, a, x[i + 5], 21, 0xfc93a039);
    a = II(a, b, c, d, x[i + 12], 6, 0x655b59c3);
    d = II(d, a, b, c, x[i + 3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[i + 10], 15, 0xffeff47d);
    b = II(b, c, d, a, x[i + 1], 21, 0x85845dd1);
    a = II(a, b, c, d, x[i + 8], 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[i + 15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[i + 6], 15, 0xa3014314);
    b = II(b, c, d, a, x[i + 13], 21, 0x4e0811a1);
    a = II(a, b, c, d, x[i + 4], 6, 0xf7537e82);
    d = II(d, a, b, c, x[i + 11], 10, 0xbd3af235);
    c = II(c, d, a, b, x[i + 2], 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[i + 9], 21, 0xeb86d391);

    a = addUnsigned(a, oldA);
    b = addUnsigned(b, oldB);
    c = addUnsigned(c, oldC);
    d = addUnsigned(d, oldD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

/* ---- Styles ---- */
const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  fontFamily: 'var(--font-sans)',
};

const radioLabel: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
  marginRight: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const controlRow: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  flexWrap: 'wrap',
  marginBottom: 12,
  alignItems: 'center',
};

export default function Md5() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'32' | '16'>('32');
  const [uppercase, setUppercase] = useState(false);

  const compute = useCallback((text: string, m: '32' | '16', up: boolean) => {
    if (!text) return '';
    const hash = md5(text);
    const result = m === '16' ? hash.substring(8, 24) : hash;
    return up ? result.toUpperCase() : result;
  }, []);

  useEffect(() => {
    setOutput(compute(input, mode, uppercase));
  }, [input, mode, uppercase, compute]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  const controls = (
    <div>
      <div style={labelStyle}>输出格式</div>
      <div style={controlRow}>
        <label style={radioLabel}>
          <input
            type="radio"
            checked={mode === '32'}
            onChange={() => setMode('32')}
            style={{ accentColor: 'var(--color-blue)' }}
          />
          32位 (小写)
        </label>
        <label style={radioLabel}>
          <input
            type="radio"
            checked={mode === '16'}
            onChange={() => setMode('16')}
            style={{ accentColor: 'var(--color-blue)' }}
          />
          16位 (小写)
        </label>
        <label style={radioLabel}>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            style={{ accentColor: 'var(--color-blue)' }}
          />
          大写输出
        </label>
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-md5"
      title="MD5加密"
      description="计算文本的MD5摘要值，支持16位和32位输出格式，可选大写输出"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要计算MD5的文本..."
      children={controls}
    />
  );
}
