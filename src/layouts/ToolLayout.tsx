import React, { type ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { showToast } from '../components/ui/Toast';
import { getRelatedTools } from '../lib/tool-registry';

/* ---- Styles ---- */
const containerStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  marginBottom: 8,
};

const descStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  lineHeight: 1.6,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: 8,
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const textareaBase: React.CSSProperties = {
  width: '100%',
  minHeight: 160,
  padding: 16,
  borderRadius: 16,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-tool)',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)',
  lineHeight: 1.7,
  resize: 'vertical',
  outline: 'none',
  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
};

const textareaFocusStyle: React.CSSProperties = {
  ...textareaBase,
  borderColor: 'var(--color-blue)',
  boxShadow: '0 0 0 3px rgba(136, 157, 240, 0.15)',
};

const actionBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 20,
};

const btnBase: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: 12,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  boxShadow: '0 2px 0 var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
  boxShadow: '0 2px 0 #6a7fd0',
};

const outputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 100,
  padding: 16,
  borderRadius: 16,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)',
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflow: 'auto',
  maxHeight: 500,
};

const errorStyle: React.CSSProperties = {
  color: 'var(--color-red)',
  fontSize: 13,
  marginTop: 6,
  fontFamily: 'var(--font-sans)',
};

const relatedSectionStyle: React.CSSProperties = {
  marginTop: 40,
  paddingTop: 24,
  borderTop: '1px solid var(--border-light)',
};

const relatedGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: 10,
  marginTop: 12,
};

const relatedCardStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const favBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 16,
  fontWeight: 600,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
  marginLeft: 16,
};

const favBtnActiveStyle: React.CSSProperties = {
  ...favBtnStyle,
  background: 'var(--color-yellow)',
  borderColor: 'var(--color-yellow)',
  color: '#fff',
};

/* ---- Props ---- */
export interface ToolLayoutProps {
  toolId: string;
  title: string;
  description: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  outputValue: string;
  inputPlaceholder?: string;
  error?: string;
  children?: ReactNode; // extra content between input and output
  extraActions?: ReactNode; // extra action buttons
}

export default function ToolLayout({
  toolId,
  title,
  description,
  inputValue,
  onInputChange,
  outputValue,
  inputPlaceholder = '在此粘贴或输入内容...',
  error,
  children,
  extraActions,
}: ToolLayoutProps) {
  const navigate = useNavigate();
  const { copied, copy } = useCopyToClipboard();
  const addToHistory = useAppStore((s) => s.addToHistory);
  const isFavorite = useAppStore((s) => s.isFavorite);
  const addFavorite = useAppStore((s) => s.addFavorite);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const relatedTools = getRelatedTools(toolId);

  const fav = isFavorite(toolId);

  const handleToggleFav = useCallback(() => {
    if (fav) {
      removeFavorite(toolId);
      showToast('已取消收藏', 'info');
    } else {
      addFavorite(toolId);
      showToast('已加入收藏', 'success');
    }
  }, [fav, toolId, addFavorite, removeFavorite]);

  // Track usage
  React.useEffect(() => {
    addToHistory(toolId);
  }, [toolId, addToHistory]);

  const handleCopy = async () => {
    if (!outputValue) return;
    const ok = await copy(outputValue);
    showToast(ok ? '已复制到剪贴板' : '复制失败，请手动复制', ok ? 'success' : 'error');
  };

  const handleClear = () => {
    onInputChange('');
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={titleStyle}>{title}</h1>
          <button
            style={fav ? favBtnActiveStyle : favBtnStyle}
            onClick={handleToggleFav}
            title={fav ? '取消收藏' : '加入收藏'}
          >
            {fav ? '★' : '☆'} {fav ? '已收藏' : '收藏'}
          </button>
        </div>
        <p style={descStyle}>{description}</p>
      </div>

      {/* Input Section */}
      <div style={sectionStyle}>
        <div style={labelStyle}>输入</div>
        <textarea
          style={textareaBase}
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={(e) => {
            Object.assign(e.target.style, textareaFocusStyle);
          }}
          onBlur={(e) => {
            Object.assign(e.target.style, textareaBase);
          }}
        />
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      {/* Action Bar */}
      <div style={actionBarStyle}>
        <button
          style={btnPrimary}
          onClick={handleCopy}
          disabled={!outputValue}
        >
          {copied ? '✓ 已复制' : '📋 一键复制'}
        </button>
        <button style={btnBase} onClick={handleClear}>
          🗑 一键清空
        </button>
        {extraActions}
      </div>

      {/* Extra content (e.g., tool-specific controls) */}
      {children}

      {/* Output Section */}
      {outputValue && (
        <div style={sectionStyle}>
          <div style={labelStyle}>结果</div>
          <div style={outputStyle}>{outputValue}</div>
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div style={relatedSectionStyle}>
          <div style={labelStyle}>相关工具推荐</div>
          <div style={relatedGridStyle}>
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                style={relatedCardStyle}
                onClick={() => navigate(`/tool/${tool.id}`)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                  {tool.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
