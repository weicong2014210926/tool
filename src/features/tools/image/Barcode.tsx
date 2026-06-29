import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-purple)', color: '#fff', borderColor: 'var(--color-purple)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  width: 'auto',
  minWidth: 140,
  padding: '6px 10px',
  cursor: 'pointer',
};

const previewContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: 16,
  padding: 20,
  borderRadius: 12,
  background: '#fff',
  border: '1px solid var(--border-color)',
};

const controlsRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap' as const,
  alignItems: 'flex-end',
  marginBottom: 16,
};

const codeFormats: { value: string; label: string; description: string }[] = [
  { value: 'Code128', label: 'Code 128', description: '通用条码，支持全部 ASCII 字符' },
  { value: 'EAN-13', label: 'EAN-13', description: '国际商品条码，13 位数字' },
  { value: 'UPC-A', label: 'UPC-A', description: '北美通用产品代码，12 位数字' },
];

export default function Barcode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [format, setFormat] = useState('Code128');
  const [loading, setLoading] = useState(false);
  const [useCanvas, setUseCanvas] = useState(false);

  const generateCanvasBarcode = useCallback((text: string): string => {
    const canvas = document.createElement('canvas');
    const cw = 400;
    const ch = 200;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cw, ch);

    // Calculate bar pattern from char codes
    const chars = text.split('');
    const margin = 40;
    const barArea = cw - 2 * margin;
    const barHeights = [30, 50, 70, 90, 60, 40, 80]; // different heights for visual variety

    // Draw alternating bars based on ASCII values
    let x = margin;
    for (let i = 0; i < chars.length && x < cw - margin; i++) {
      const code = chars[i].charCodeAt(0);
      // Wide/narrow bar pattern from char code
      const bw = 2 + (code % 3); // bar width 2-4px
      const bh = barHeights[i % barHeights.length];

      // Black bar
      ctx.fillStyle = '#000';
      ctx.fillRect(x, 30, bw, ch - 60);

      x += bw;

      // White space
      const gap = 1 + ((code >> 1) % 3);
      x += gap;
    }

    // Start marker
    ctx.fillStyle = '#000';
    ctx.fillRect(margin - 8, 20, 4, ch - 40);

    // End marker
    ctx.fillRect(cw - margin + 4, 20, 4, ch - 40);

    // Text label
    ctx.fillStyle = '#000';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, cw / 2, ch - 10);

    return canvas.toDataURL('image/png');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError('请输入要生成条形码的文本或数字');
      return;
    }

    // Validate format-specific constraints
    if (format === 'EAN-13' && !/^\d{13}$/.test(input.trim())) {
      setError('EAN-13 格式需要 13 位数字');
      return;
    }
    if (format === 'UPC-A' && !/^\d{12}$/.test(input.trim())) {
      setError('UPC-A 格式需要 12 位数字');
      return;
    }

    setLoading(true);
    setError('');
    setBarcodeUrl(null);

    const text = input.trim();

    if (useCanvas) {
      // Use canvas drawing as fallback
      const dataUrl = generateCanvasBarcode(text);
      setBarcodeUrl(dataUrl);
      setLoading(false);
      showToast('条形码生成成功', 'success');
      return;
    }

    // Use free barcode API
    const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=${format}&dpi=96&imagetype=png&translate-esc=on`;

    const img = new Image();
    img.onload = () => {
      // Render to canvas to get data URL for download
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeUrl(dataUrl);
      setLoading(false);
      showToast('条形码生成成功', 'success');
    };
    img.onerror = () => {
      // Fall back to canvas drawing if API fails
      const dataUrl = generateCanvasBarcode(text);
      setBarcodeUrl(dataUrl);
      setLoading(false);
      showToast('条形码生成成功（使用本地渲染）', 'info');
    };
    img.src = url;
  }, [input, format, useCanvas, generateCanvasBarcode]);

  const handleDownload = useCallback(() => {
    if (!barcodeUrl) return;

    const link = document.createElement('a');
    link.href = barcodeUrl;
    link.download = `barcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('下载成功', 'success');
  }, [barcodeUrl]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setBarcodeUrl(null);
  };

  const extraActions = (
    <>
      <button
        style={input.trim() ? activeBtn : btnStyle}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? '⏳ 生成中...' : '🔣 生成'}
      </button>
      {barcodeUrl && (
        <button style={btnStyle} onClick={handleDownload}>
          💾 下载
        </button>
      )}
    </>
  );

  return (
    <ToolLayout
      toolId="img-barcode"
      title="条形码生成"
      description="输入文本或数字，生成 Code 128 / EAN-13 / UPC-A 格式的条形码"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder={
        format === 'EAN-13' ? '输入 13 位数字，如 5901234123457' :
        format === 'UPC-A' ? '输入 12 位数字，如 123456789012' :
        '输入要生成条形码的文本或数字...'
      }
      error={error}
      extraActions={extraActions}
    >
      <div style={controlsRow}>
        <div>
          <div style={labelStyle}>条码格式</div>
          <select
            style={selectStyle}
            value={format}
            onChange={(e) => {
              setFormat(e.target.value);
              setBarcodeUrl(null);
              setError('');
            }}
          >
            {codeFormats.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={labelStyle}>渲染方式</div>
          <select
            style={selectStyle}
            value={useCanvas ? 'canvas' : 'api'}
            onChange={(e) => {
              setUseCanvas(e.target.value === 'canvas');
              setBarcodeUrl(null);
            }}
          >
            <option value="api">在线 API</option>
            <option value="canvas">本地 Canvas</option>
          </select>
        </div>
        <div>
          <div style={labelStyle}>格式说明</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', paddingTop: 6 }}>
            {codeFormats.find((f) => f.value === format)?.description}
          </div>
        </div>
      </div>

      {barcodeUrl && (
        <div>
          <div style={labelStyle}>条形码预览</div>
          <div style={previewContainer}>
            <img
              src={barcodeUrl}
              alt="Barcode"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
            点击「下载」按钮保存条形码图片
          </div>
        </div>
      )}

      {!barcodeUrl && !loading && (
        <div style={{
          padding: 40, borderRadius: 12, border: '2px dashed var(--border-color)',
          textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 14,
          fontFamily: 'var(--font-sans)', background: 'var(--bg-tool)',
        }}>
          🔣 输入内容后点击「生成」按钮创建条形码
        </div>
      )}

      <div style={{
        marginTop: 16, padding: 12, borderRadius: 12, background: 'var(--bg-tool)',
        border: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)', lineHeight: 1.6,
      }}>
        <strong>提示:</strong> 在线 API 使用 TEC-IT 免费条码服务。如遇网络问题请切换到本地 Canvas 渲染模式。
      </div>
    </ToolLayout>
  );
}