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
  minWidth: 120,
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

export default function QRCodeGen() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [size, setSize] = useState(300);
  const [ecLevel, setEcLevel] = useState('M');
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError('请输入要生成二维码的文本或链接');
      return;
    }

    setLoading(true);
    setError('');
    setQrUrl(null);

    const text = encodeURIComponent(input.trim());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${text}&ecc=${ecLevel}`;

    // Load image to verify it works
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setQrUrl(url);
      setLoading(false);
      showToast('二维码生成成功', 'success');
    };
    img.onerror = () => {
      setError('二维码生成失败，请检查网络连接');
      setLoading(false);
    };
    img.src = url;
  }, [input, size, ecLevel]);

  const handleDownload = useCallback(() => {
    if (!qrUrl) return;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('下载成功', 'success');
  }, [qrUrl]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setQrUrl(null);
  };

  const extraActions = (
    <>
      <button
        style={input.trim() ? activeBtn : btnStyle}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? '⏳ 生成中...' : '🎯 生成二维码'}
      </button>
      {qrUrl && (
        <button style={btnStyle} onClick={handleDownload}>
          💾 下载
        </button>
      )}
    </>
  );

  return (
    <ToolLayout
      toolId="img-qrcode-gen"
      title="二维码生成"
      description="输入文本或链接，一键生成二维码图片。支持自定义尺寸和容错级别"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入要生成二维码的文本、URL 或其他内容..."
      error={error}
      extraActions={extraActions}
    >
      <div style={controlsRow}>
        <div>
          <div style={labelStyle}>容错级别</div>
          <select
            style={selectStyle}
            value={ecLevel}
            onChange={(e) => setEcLevel(e.target.value)}
          >
            <option value="L">L - 约 7% 容错</option>
            <option value="M">M - 约 15% 容错</option>
            <option value="Q">Q - 约 25% 容错</option>
            <option value="H">H - 约 30% 容错</option>
          </select>
        </div>
        <div>
          <div style={labelStyle}>尺寸</div>
          <select
            style={selectStyle}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={200}>200 x 200</option>
            <option value={300}>300 x 300</option>
            <option value={400}>400 x 400</option>
          </select>
        </div>
      </div>

      {qrUrl && (
        <div>
          <div style={labelStyle}>二维码预览</div>
          <div style={previewContainer}>
            <img
              src={qrUrl}
              alt="QR Code"
              style={{ maxWidth: 400, height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
            点击「下载」按钮保存二维码图片
          </div>
        </div>
      )}

      {!qrUrl && !loading && (
        <div style={{
          padding: 40, borderRadius: 12, border: '2px dashed var(--border-color)',
          textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 14,
          fontFamily: 'var(--font-sans)', background: 'var(--bg-tool)',
        }}>
          🎯 输入内容后点击「生成二维码」按钮
        </div>
      )}

    </ToolLayout>
  );
}
