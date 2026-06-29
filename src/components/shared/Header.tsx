import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { searchTools, getPopularTools, type ToolEntry } from '../../lib/tool-registry';
import { SITE_NAME } from '../../lib/constants';
import { useI18n } from '../../lib/i18n';
import { useResponsive } from '../../hooks';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

const headerStyle: React.CSSProperties = {
  height: 'var(--header-height)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  background: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-light)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  gap: 16,
  transition: 'background-color var(--transition-normal)',
};

const logoStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: 'var(--color-blue)',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, var(--color-blue), var(--color-teal))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  flexShrink: 0,
  userSelect: 'none',
};

const searchWrapperStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 480,
  position: 'relative',
  margin: '0 auto',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 16px',
  borderRadius: 18,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'all var(--transition-fast)',
};

const searchDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 44,
  left: 0,
  right: 0,
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: 12,
  boxShadow: 'var(--shadow-lg)',
  maxHeight: 320,
  overflowY: 'auto',
  zIndex: 200,
  padding: 4,
};

const searchItemStyle: React.CSSProperties = {
  padding: '10px 16px',
  cursor: 'pointer',
  borderRadius: 8,
  fontSize: 14,
  transition: 'background var(--transition-fast)',
};

const dropdownTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  padding: '6px 16px 4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'var(--font-sans)',
};

const themeBtnBase: React.CSSProperties = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border-color)',
  borderRadius: 10,
  background: 'var(--bg-primary)',
  cursor: 'pointer',
  fontSize: 16,
  transition: 'all var(--transition-fast)',
  flexShrink: 0,
  color: 'var(--text-primary)',
};

const hamburgerStyle: React.CSSProperties = {
  ...themeBtnBase,
};

const langBtnStyle: React.CSSProperties = {
  ...themeBtnBase,
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'var(--font-sans)',
  width: 40,
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  padding: '4px 0',
};

const chipStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: 12,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  transition: 'all var(--transition-fast)',
  whiteSpace: 'nowrap',
};

const TRENDING_KEYWORDS = ['个税计算', 'Base64', '二维码', 'JSON格式化', '字数统计'];

export default function Header() {
  const navigate = useNavigate();
  const { setSidebarOpen, setSearchQuery } = useAppStore();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ToolEntry[]>([]);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { toggleTheme, theme } = useAppStore();
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const { t } = useI18n();
  const { isMobile } = useResponsive();

  const popularSuggestions = useMemo(() => getPopularTools(5), []);

  const handleSearch = useCallback((val: string) => {
    setQ(val);
    if (val.trim().length >= 2) {
      setResults(searchTools(val).slice(0, 8));
    } else {
      setResults([]);
    }
  }, []);

  const handleSelect = useCallback((tool: ToolEntry) => {
    setQ('');
    setResults([]);
    setFocused(false);
    setSearchQuery(tool.name);
    navigate(`/tool/${tool.id}`);
  }, [navigate, setSearchQuery]);

  const handleChipClick = useCallback((keyword: string) => {
    setSearchQuery(keyword);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setFocused(false);
    setQ('');
    setResults([]);
  }, [navigate, setSearchQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && q.trim()) {
      setSearchQuery(q);
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setFocused(false);
      setResults([]);
    }
  }, [q, navigate, setSearchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggleLang = useCallback(() => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  }, [lang, setLang]);

  const themeIcon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻';

  return (
    <header style={headerStyle}>
      {/* Hamburger (mobile) */}
      {isMobile && (
        <button
          style={hamburgerStyle}
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="打开菜单"
        >
          ☰
        </button>
      )}

      {/* Logo */}
      <div style={logoStyle} onClick={() => navigate('/')} role="button" tabIndex={0}>
        {SITE_NAME}
      </div>

      {/* Search */}
      <div ref={wrapperRef} style={searchWrapperStyle}>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          style={searchInputStyle}
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
        />
        {focused && (
          <div style={searchDropdownStyle}>
            {q.trim().length >= 2 && results.length > 0 && (
              <>
                {results.map((tool) => (
                  <div
                    key={tool.id}
                    style={searchItemStyle}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'var(--bg-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{tool.name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 12 }}>
                      {tool.category}
                    </span>
                  </div>
                ))}
              </>
            )}
            {q.trim().length < 2 && (
              <>
                <div style={dropdownTitleStyle}>{t('search.popular')}</div>
                {popularSuggestions.map((tool) => (
                  <div
                    key={tool.id}
                    style={searchItemStyle}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'var(--bg-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{tool.name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 12 }}>
                      {tool.category}
                    </span>
                  </div>
                ))}
                <div style={{ ...dropdownTitleStyle, marginTop: 4 }}>{t('search.trending')}</div>
                <div style={{ padding: '4px 16px 8px' }}>
                  <div style={chipRowStyle}>
                    {TRENDING_KEYWORDS.map((kw) => (
                      <span
                        key={kw}
                        style={chipStyle}
                        onClick={() => handleChipClick(kw)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'var(--bg-primary)';
                          (e.target as HTMLElement).style.color = 'var(--color-blue)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'var(--bg-card)';
                          (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
            {q.trim().length >= 2 && results.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {t('search.noResults')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lang Toggle */}
      <button
        style={langBtnStyle}
        onClick={handleToggleLang}
        title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
        aria-label="切换语言"
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>

      {/* Theme Toggle */}
      <button
        style={themeBtnBase}
        onClick={toggleTheme}
        title="切换主题"
        aria-label="切换主题"
      >
        {themeIcon}
      </button>
    </header>
  );
}
