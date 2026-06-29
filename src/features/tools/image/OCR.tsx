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
  background: '#fff8e1',
  border: '1px solid #ffc107',
  fontSize: 13,
  color: '#5d4037',
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

const spinnerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  justifyContent: 'center',
  padding: 20,
  fontSize: 14,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)',
};

export default function OCR() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('请上传 JPG、PNG 或 WebP 格式的图片');
      setImageSrc(null);
      return;
    }

    setFileName(file.name);
    setError('');
    setOutput('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleOCR = useCallback(async () => {
    if (!imageSrc) {
      setError('请先上传图片');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    // Simulated OCR processing with animation
    const stages = [
      '🔍 正在预处理图片...',
      '📐 正在检测文字区域...',
      '🔤 正在识别文字内容...',
      '✅ 识别完成',
    ];

    let result = '';
    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      result = stages.slice(0, i + 1).join('\n');
      setOutput(result);
    }

    // Simulated OCR result
    const simulatedText = `====================
OCR 识别结果（演示版本）
====================

文件: ${fileName}
识别时间: ${new Date().toLocaleString()}
识别引擎: 演示模式

--------------------
识别内容:
--------------------
[演示数据] 图片文字识别功能需要接入 OCR 引擎。
当前为演示版本，展示了完整的交互流程。

未来集成方案:
1. 使用 tesseract.js 浏览器端 OCR
   - npm install tesseract.js
   - 支持 100+ 语言识别

2. 使用百度/腾讯云 OCR API
   - 需要 API Key 和 Secret Key
   - 识别准确率更高

3. 使用 PaddleOCR WebAssembly
   - 完全离线运行
   - 支持中英文混合识别

--------------------
如需完整功能，请选择上述方案之一进行集成。
====================`;

    setOutput(simulatedText);
    setLoading(false);
    showToast('识别完成（演示模式）', 'info');
  }, [imageSrc, fileName]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
  };

  const extraActions = (
    <>
      <button
        style={btnStyle}
        onClick={() => fileInputRef.current?.click()}
      >
        📁 上传图片
      </button>
      <button
        style={imageSrc ? activeBtn : btnStyle}
        onClick={handleOCR}
        disabled={loading || !imageSrc}
      >
        {loading ? '⏳ 识别中...' : '🔍 开始识别'}
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="img-ocr"
      title="图片文字识别 (OCR)"
      description="上传图片，提取其中的文字内容。支持 JPG、PNG、WebP 格式"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="可在此输入补充说明，或直接上传图片..."
      error={error}
      extraActions={extraActions}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>图片预览</div>
        {imageSrc ? (
          <div style={previewContainer}>
            <img src={imageSrc} alt="预览" style={imgPreview} />
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
            📷 点击上方「上传图片」按钮选择文件
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>集成说明</div>
        <div style={noticeStyle}>
          ⚠️ 图片文字识别功能需要接入 OCR 引擎。当前为演示版本，请上传图片后点击识别按钮体验流程。<br/><br/>
          <strong>推荐集成方案:</strong><br/>
          1. <strong>tesseract.js</strong> - 浏览器端 OCR，支持多语言<br/>
          2. <strong>百度/腾讯云 OCR API</strong> - 高精度云端识别<br/>
          3. <strong>PaddleOCR WebAssembly</strong> - 完全离线运行
        </div>
      </div>

      {loading && (
        <div style={spinnerStyle}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
          正在处理中...
        </div>
      )}

      {output && !loading && (
        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>识别结果</div>
          <div style={resultStyle}>{output}</div>
        </div>
      )}
    </ToolLayout>
  );
}
