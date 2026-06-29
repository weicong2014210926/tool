import { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchTools } from '../../lib/tool-registry';
import { Title } from 'animal-island-ui';

const TRENDING_KEYWORDS = ['个税计算', 'Base64', '二维码', 'JSON格式化', '字数统计'];

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 14,
  marginTop: 16,
};

const toolCardStyle: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: 16,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  cursor: 'pointer',
  transition: 'all var(--transition-slow)',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 60,
  color: 'var(--text-muted)',
  fontSize: 16,
  fontFamily: 'var(--font-sans)',
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 16,
};

const chipStyle: React.CSSProperties = {
  padding: '6px 16px',
  borderRadius: 16,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  transition: 'all var(--transition-fast)',
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const results = useMemo(() => searchTools(q), [q]);

  const handleChipClick = useCallback((keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  }, [navigate]);

  if (!q) {
    return <div style={emptyStyle}>请输入搜索关键词</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title size="large" color="app-blue">
        搜索结果：{q}
      </Title>
      <p style={{
        fontSize: 14,
        color: 'var(--text-muted)',
        marginTop: 8,
        fontFamily: 'var(--font-sans)',
      }}>
        找到 {results.length} 个相关工具
      </p>

      {results.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            未找到相关工具
          </p>
          <p>试试其他关键词，或浏览上方分类导航</p>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
            试试这些热门关键词
          </p>
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
      ) : (
        <div style={gridStyle}>
          {results.map((tool) => (
            <div
              key={tool.id}
              style={toolCardStyle}
              className="magnetic"
              onClick={() => navigate(`/tool/${tool.id}`)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                (e.target as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {tool.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                {tool.category} · 热度 {tool.popularity}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {tool.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
