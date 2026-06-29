import React, { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-purple)', color: '#fff', borderColor: 'var(--color-purple)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };

const noticeStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  background: '#e3f2fd',
  border: '1px solid #2196f3',
  fontSize: 13,
  color: '#0d47a1',
  fontFamily: 'var(--font-sans)',
  marginBottom: 16,
  lineHeight: 1.6,
};

const previewContainer: React.CSSProperties = {
  marginBottom: 16,
  textAlign: 'center' as const,
};

const imgPreview: React.CSSProperties = {
  maxWidth: 400,
  maxHeight: 400,
  borderRadius: 12,
  border: '1px solid var(--border-color)',
  objectFit: 'contain' as const,
};

const resultStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
  fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)',
  fontSize: 13,
  lineHeight: 1.7,
  color: 'var(--text-primary)',
  whiteSpace: 'pre-wrap' as const,
  maxHeight: 400,
  overflow: 'auto',
};

const successStyle: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  background: '#e8f5e9',
  border: '1px solid #4caf50',
  textAlign: 'center' as const,
};

export default function QRCodeDecode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [demoResult, setDemoResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('请上传常见图片格式（JPG、PNG、WebP、GIF、BMP）');
      setImageSrc(null);
      return;
    }

    setFileName(file.name);
    setError('');
    setDemoResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDecode = useCallback(async () => {
    if (!imageSrc) {
      setError('请先上传二维码图片');
      return;
    }

    setLoading(true);
    setError('');
    setDemoResult(null);

    // Simulated decode processing
    const stages = [
      '🔍 正在加载图片...',
      '📐 正在检测二维码区域...',
      '🔎 正在解析二维码...',
    ];

    let progress = '';
    for (const stage of stages) {
      await new Promise((r) => setTimeout(r, 700));
      progress += stage + '\n';
      setOutput(progress);
    }

    // Demo result - simulate finding some content
    const simulatedData = {
      type: 'QR Code (演示模式)',
      content: '[演示数据] https://example.com/demo-qr-content',
      format: 'URL',
      charset: 'UTF-8',
      timestamp: new Date().toLocaleString(),
    };

    const resultText = `====================
二维码解码结果（演示版本）
====================

类型: ${simulatedData.type}
格式: ${simulatedData.format}
编码: ${simulatedData.charset}
时间: ${simulatedData.timestamp}

--------------------
解码内容:
--------------------
${simulatedData.content}

====================
`;

    setOutput(resultText);
    setDemoResult(simulatedData.content);
    setLoading(false);
    showToast('解码完成（演示模式）', 'info');
  }, [imageSrc]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setDemoResult(null);
  };

  const extraActions = (
    <>
      <button
        style={btnStyle}
        onClick={() => fileInputRef.current?.click()}
      >
        📁 上传二维码
      </button>
      <button
        style={imageSrc ? activeBtn : btnStyle}
        onClick={handleDecode}
        disabled={loading || !imageSrc}
      >
        {loading ? '⏳ 解码中...' : '🔓 解码'}
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="img-qrcode-decode"
      title="二维码解码"
      description="上传二维码图片，解析其中包含的文本或链接信息"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="可在此输入补充说明，或直接上传图片"
      error={error}
      extraActions={extraActions}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>二维码图片</div>
        {imageSrc ? (
          <div style={previewContainer}>
            <img src={imageSrc} alt="二维码预览" style={imgPreview} />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-sans)' }}>
              {fileName}
            </div>
          </div>
        ) : (
          <div style={{
            padding: 40, borderRadius: 12, border: '2px dashed var(--border-color)',
            textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 14,
            fontFamily: 'var(--font-sans)', background: 'var(--bg-tool)',
          }}>
            📱 点击「上传二维码」选择二维码图片
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>集成说明</div>
        <div style={noticeStyle}>
          ⚠️ 二维码解码需要接入 jsQR 或 qrcode-decoder 库。当前为演示版本。<br/><br/>
          <strong>推荐集成方案:</strong><br/>
          1. <strong>jsQR</strong> - 纯 JavaScript 二维码解码库，支持浏览器端<br/>
          2. <strong>qrcode-decoder</strong> - 轻量级二维码解码<br/>
          3. <strong>html5-qrcode</strong> - 支持实时摄像头扫描
        </div>
      </div>

      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
          padding: 20, fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)',
        }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
          正在解码中...
        </div>
      )}

      {demoResult && !loading && (
        <div style={successStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2e7d32', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
            ✅ 解码成功（演示）
          </div>
          <div style={{
            fontSize: 14, color: '#2e7d32', wordBreak: 'break-all',
            fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)',
          }}>
            {demoResult}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
