import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-purple)', color: '#fff', borderColor: 'var(--color-purple)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };

const successStyle: React.CSSProperties = {
  padding: 16, borderRadius: 12, background: '#e8f5e9', border: '1px solid #4caf50',
  fontSize: 13, color: '#2e7d32', fontFamily: 'var(--font-sans)', marginBottom: 16,
};

const errorBoxStyle: React.CSSProperties = {
  padding: 16, borderRadius: 12, background: '#fce4ec', border: '1px solid #e91e63',
  fontSize: 13, color: '#880e4f', fontFamily: 'var(--font-sans)', marginBottom: 16,
  lineHeight: 1.6,
};

const previewContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: 16,
  padding: 20,
  borderRadius: 12,
  background: '#fff',
  border: '1px solid var(--border-color)',
};

const infoRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap' as const,
  marginBottom: 8,
};

const infoItem: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
};

// Validate ISBN-10 checksum (mod 11, check digit 0-9 or X)
function validateISBN10(isbn: string): { valid: boolean; checkDigit: string; computed: string } {
  const digits = isbn.replace(/[-\s]/g, '');
  if (digits.length !== 10) return { valid: false, checkDigit: '', computed: '' };

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const d = parseInt(digits[i], 10);
    if (isNaN(d)) return { valid: false, checkDigit: '', computed: '' };
    sum += d * (10 - i);
  }

  const remainder = sum % 11;
  const computed = remainder === 0 ? '0' : remainder === 1 ? 'X' : String(11 - remainder);
  const checkDigit = digits[9].toUpperCase();

  return { valid: computed === checkDigit, checkDigit, computed };
}

// Validate ISBN-13 checksum (mod 10)
function validateISBN13(isbn: string): { valid: boolean; checkDigit: string; computed: string } {
  const digits = isbn.replace(/[-\s]/g, '');
  if (digits.length !== 13) return { valid: false, checkDigit: '', computed: '' };

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits[i], 10);
    if (isNaN(d)) return { valid: false, checkDigit: '', computed: '' };
    sum += d * (i % 2 === 0 ? 1 : 3);
  }

  const computed = String((10 - (sum % 10)) % 10);
  const checkDigit = digits[12];

  return { valid: computed === checkDigit, checkDigit, computed };
}

// Detect ISBN type from input
function detectISBN(input: string): { type: 'ISBN-10' | 'ISBN-13' | null; clean: string } {
  const clean = input.replace(/[-\s]/g, '');
  if (clean.length === 10 && /^[\d]{9}[\dXx]$/i.test(clean)) {
    return { type: 'ISBN-10', clean };
  }
  if (clean.length === 13 && /^\d{13}$/.test(clean)) {
    return { type: 'ISBN-13', clean };
  }
  return { type: null, clean };
}

export default function ISBN() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState<{
    type: string;
    valid: boolean;
    checkDigit: string;
    computed: string;
  } | null>(null);
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = useCallback(async () => {
    if (!input.trim()) {
      setError('请输入 ISBN 号码');
      return;
    }

    setLoading(true);
    setError('');
    setInfo(null);
    setBarcodeUrl(null);
    setOutput('');

    const { type, clean } = detectISBN(input.trim());

    if (!type) {
      setError('无法识别 ISBN 格式。请确认是 10 位或 13 位数字（可包含连字符）');
      setLoading(false);
      return;
    }

    let result: { valid: boolean; checkDigit: string; computed: string };
    if (type === 'ISBN-10') {
      result = validateISBN10(clean);
    } else {
      result = validateISBN13(clean);
    }

    setInfo({
      type,
      ...result,
    });

    if (!result.valid) {
      const fixMsg = type === 'ISBN-10'
        ? `正确的校验位应为: ${result.computed}（当前为: ${result.checkDigit}）\n请将最后一位改为 ${result.computed} 即可获得有效 ISBN。`
        : `正确的校验位应为: ${result.computed}（当前为: ${result.checkDigit}）\n请将最后一位改为 ${result.computed} 即可获得有效 ISBN。`;

      setError(`❌ ISBN 校验失败\n${fixMsg}`);
      setLoading(false);
      showToast('ISBN 校验失败', 'error');
      return;
    }

    showToast('✅ ISBN 校验通过', 'success');

    // Generate barcode for valid ISBN-13 (or convert ISBN-10 to ISBN-13 format for display)
    // ISBN-13 can use EAN-13 barcode
    let barcodeData = '';
    if (type === 'ISBN-13') {
      barcodeData = clean;
    } else {
      // Convert ISBN-10 to ISBN-13 format: prefix 978 + first 9 digits + new check digit
      const prefix = '978';
      const body = clean.slice(0, 9);
      let sum = 0;
      const digits = prefix + body;
      for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i], 10) * (i % 2 === 0 ? 1 : 3);
      }
      const newCheck = String((10 - (sum % 10)) % 10);
      barcodeData = prefix + body + newCheck;
    }

    // Generate barcode image
    const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcodeData)}&code=EAN-13&dpi=96&imagetype=png`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeUrl(dataUrl);
      setOutput(`ISBN ${type} 校验通过 ✓\n号码: ${clean}\n校验位: ${result.checkDigit}\n条码数据: ${barcodeData}`);
      setLoading(false);
    };
    img.onerror = () => {
      setOutput(`ISBN ${type} 校验通过 ✓\n号码: ${clean}\n校验位: ${result.checkDigit}\n条码数据: ${barcodeData}\n（注：条码 API 暂时不可用）`);
      setLoading(false);
    };
    img.src = url;
  }, [input]);

  const handleDownload = useCallback(() => {
    if (!barcodeUrl) return;

    const link = document.createElement('a');
    link.href = barcodeUrl;
    link.download = `isbn-barcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('下载成功', 'success');
  }, [barcodeUrl]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setInfo(null);
    setBarcodeUrl(null);
  };

  const extraActions = (
    <>
      <button
        style={input.trim() ? activeBtn : btnStyle}
        onClick={handleValidate}
        disabled={loading}
      >
        {loading ? '⏳ 验证中...' : '✅ 验证并生成'}
      </button>
      {barcodeUrl && (
        <button style={btnStyle} onClick={handleDownload}>
          💾 下载条形码
        </button>
      )}
    </>
  );

  return (
    <ToolLayout
      toolId="img-isbn"
      title="ISBN 校验与条形码"
      description="验证 ISBN-10 或 ISBN-13 的校验位，生成对应的商品条形码"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入 ISBN 号码，如 0-306-40615-2 或 978-7-115-12345-7"
      error={error}
      extraActions={extraActions}
    >
      {info && info.valid && (
        <div style={successStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
            ✅ {info.type} 校验通过
          </div>
          <div style={infoRow}>
            <div style={infoItem}>类型: {info.type}</div>
            <div style={infoItem}>校验位: {info.checkDigit}</div>
          </div>
        </div>
      )}

      {info && !info.valid && (
        <div style={errorBoxStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
            ❌ {info.type} 校验失败
          </div>
          <div>
            当前校验位: {info.checkDigit}，正确校验位应为: {info.computed}
          </div>
          <div style={{ marginTop: 8 }}>
            修改方法：将最后一位数字替换为 <strong>{info.computed}</strong> 即可。
          </div>
        </div>
      )}

      {barcodeUrl && (
        <div>
          <div style={labelStyle}>条形码</div>
          <div style={previewContainer}>
            <img
              src={barcodeUrl}
              alt="ISBN Barcode"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
        </div>
      )}

      <div style={{
        marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tool)',
        border: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)', lineHeight: 1.8,
      }}>
        <strong>ISBN 格式说明:</strong><br />
        • ISBN-10: 10 位数字，最后一位可为 X（代表 10），使用模 11 校验<br />
        • ISBN-13: 13 位数字，使用模 10 校验，条码使用 EAN-13 标准<br />
        • 示例: ISBN-10 → 0-306-40615-2 | ISBN-13 → 978-7-115-12345-7
      </div>
    </ToolLayout>
  );
}
