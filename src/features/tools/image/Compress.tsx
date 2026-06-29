import React, { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-purple)', color: '#fff', borderColor: 'var(--color-purple)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };

const previewContainer: React.CSSProperties = {
  marginBottom: 16,
  textAlign: 'center' as const,
};

const imgPreview: React.CSSProperties = {
  maxWidth: 400,
  maxHeight: 300,
  borderRadius: 12,
  border: '1px solid var(--border-color)',
  objectFit: 'contain' as const,
};

const compareRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap' as const,
  marginBottom: 16,
};

const compareCard: React.CSSProperties = {
  flex: 1,
  minWidth: 200,
  padding: 16,
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
};

const cardLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: 4,
};

const cardValue: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: 'var(--text-primary)',
  fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)',
};

const sliderContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 16,
};

const sliderStyle: React.CSSProperties = {
  flex: 1,
  accentColor: 'var(--color-purple)',
  height: 6,
  cursor: 'pointer',
};

const MAX_DIMENSION = 1920;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function Compress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);
  const [compressedDimensions, setCompressedDimensions] = useState<{ w: number; h: number } | null>(null);
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
    setOriginalSize(file.size);
    setError('');
    setCompressedSrc(null);
    setOutput('');
    setOriginalDimensions(null);
    setCompressedDimensions(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
      };
      img.src = dataUrl;

      setImageSrc(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCompress = useCallback(() => {
    if (!imageSrc) {
      setError('请先上传图片');
      return;
    }

    setLoading(true);
    setError('');

    const img = new Image();
    img.onload = () => {
      const origW = img.width;
      const origH = img.height;

      // Calculate new dimensions (maintain aspect ratio, max 1920px)
      let newW = origW;
      let newH = origH;
      if (origW > MAX_DIMENSION || origH > MAX_DIMENSION) {
        if (origW >= origH) {
          newW = MAX_DIMENSION;
          newH = Math.round(origH * (MAX_DIMENSION / origW));
        } else {
          newH = MAX_DIMENSION;
          newW = Math.round(origW * (MAX_DIMENSION / origH));
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, newW, newH);

      setCompressedDimensions({ w: newW, h: newH });

      // Convert to JPEG at specified quality (or PNG at quality-influenced compression)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('压缩失败，请重试');
            setLoading(false);
            return;
          }

          const compressedUrl = URL.createObjectURL(blob);
          setCompressedSrc(compressedUrl);
          setCompressedSize(blob.size);

          const ratio = ((1 - blob.size / originalSize) * 100).toFixed(1);
          const sizeChange = originalSize > blob.size ? '减少' : '增加';

          setOutput(
            `原始大小: ${formatSize(originalSize)} (${origW}x${origH})\n` +
            `压缩后大小: ${formatSize(blob.size)} (${newW}x${newH})\n` +
            `${sizeChange}: ${ratio}%\n` +
            `压缩质量: ${quality}%\n` +
            `超出最大尺寸限制时自动等比缩放至 ${MAX_DIMENSION}px 以内`
          );

          setLoading(false);
          showToast(`压缩完成，${sizeChange} ${ratio}%`, 'success');
        },
        'image/jpeg',
        quality / 100
      );
    };
    img.src = imageSrc;
  }, [imageSrc, quality, originalSize]);

  const handleDownload = useCallback(() => {
    if (!compressedSrc) return;

    const link = document.createElement('a');
    link.href = compressedSrc;
    const ext = fileName.includes('.') ? '.jpg' : '';
    link.download = `compressed-${Date.now()}${ext || '.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('下载成功', 'success');
  }, [compressedSrc, fileName]);

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
        onClick={handleCompress}
        disabled={loading || !imageSrc}
      >
        {loading ? '⏳ 压缩中...' : '🗜 压缩'}
      </button>
      {compressedSrc && (
        <button style={btnStyle} onClick={handleDownload}>
          💾 下载压缩后图片
        </button>
      )}
    </>
  );

  return (
    <ToolLayout
      toolId="img-compress"
      title="图片压缩"
      description="上传 JPG/PNG 图片，调整质量进行压缩。维持宽高比，最大 1920px"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="可在此输入补充说明..."
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
        <div style={labelStyle}>压缩质量: {quality}%</div>
        <div style={sliderContainer}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>10</span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>100</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 2 }}>
          数值越低压缩率越高，图片质量越低。建议 60-90 之间。
        </div>
      </div>

      {imageSrc && (
        <div style={compareRow}>
          <div style={compareCard}>
            <div style={cardLabel}>原始图片</div>
            <div style={cardValue}>{formatSize(originalSize)}</div>
            {originalDimensions && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>
                {originalDimensions.w} x {originalDimensions.h} px
              </div>
            )}
          </div>
          {compressedSrc && (
            <div style={{ ...compareCard, border: '2px solid var(--color-purple)' }}>
              <div style={cardLabel}>压缩后</div>
              <div style={{ ...cardValue, color: 'var(--color-purple)' }}>
                {formatSize(compressedSize)}
              </div>
              {compressedDimensions && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>
                  {compressedDimensions.w} x {compressedDimensions.h} px
                </div>
              )}
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#4caf50', marginTop: 4, fontFamily: 'var(--font-sans)',
              }}>
                -{((1 - compressedSize / originalSize) * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>预览</div>
        {imageSrc ? (
          <div style={previewContainer}>
            {!compressedSrc ? (
              <img src={imageSrc} alt="原始图片" style={imgPreview} />
            ) : (
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
                    原图
                  </div>
                  <img src={imageSrc} alt="原始图片" style={imgPreview} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-purple)', marginBottom: 4, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                    压缩后
                  </div>
                  <img src={compressedSrc} alt="压缩后" style={imgPreview} />
                </div>
              </div>
            )}
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
            🖼 点击「上传图片」选择文件
          </div>
        )}
      </div>

      <div style={{
        padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tool)',
        border: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)', lineHeight: 1.8,
      }}>
        <strong>压缩说明:</strong><br />
        • 使用 Canvas API 进行本地压缩，不会上传到服务器<br />
        • 自动维持宽高比，超出 {MAX_DIMENSION}px 宽度时等比缩放<br />
        • 输出格式统一为 JPEG<br />
        • 质量值 80 通常能保持较好画质同时显著减小体积
      </div>
    </ToolLayout>
  );
}
