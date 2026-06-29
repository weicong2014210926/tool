import { useMemo, useCallback, type ReactNode, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getPopularTools, getToolById, type ToolEntry } from '../../lib/tool-registry';
import { SITE_NAME } from '../../lib/constants';
import { useAppStore } from '../../lib/store';
import { Button, Card, Title } from 'animal-island-ui';
import { showToast } from '../../components/ui/Toast';
import SkeletonCard from '../../components/ui/SkeletonCard';

const heroStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '48px 0 40px',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 900,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  marginBottom: 12,
};

const heroSubStyle: React.CSSProperties = {
  fontSize: 16,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  maxWidth: 500,
  margin: '0 auto',
  lineHeight: 1.7,
};

const categoryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 16,
  marginTop: 8,
};

const catCardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 20,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  cursor: 'pointer',
  transition: 'all var(--transition-slow)',
  boxShadow: 'var(--shadow-sm)',
  position: 'relative',
  overflow: 'hidden',
};

const catDotStyle = (color: string): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  background: color,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
});

const popularGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 12,
  marginTop: 8,
};

const toolCardStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: 16,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  cursor: 'pointer',
  transition: 'all var(--transition-slow)',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
};

const clearBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  padding: '4px 8px',
  borderRadius: 6,
  transition: 'color var(--transition-fast)',
};

const removeFavBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 6,
  right: 8,
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: 12,
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: 6,
  transition: 'color var(--transition-fast)',
};

const sectionStyle: React.CSSProperties = {
  marginTop: 48,
};

function SectionFallback({ count }: { count: number }) {
  return (
    <div style={popularGridStyle}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

const colorMap: Record<string, string> = {
  'app-blue': 'var(--color-blue)',
  'app-pink': 'var(--color-pink)',
  'app-yellow': 'var(--color-yellow)',
  'app-teal': 'var(--color-teal)',
  'app-orange': 'var(--color-orange)',
  'purple': 'var(--color-purple)',
  'app-green': 'var(--color-green)',
  'brown': 'var(--color-brown)',
  'warm-peach-pink': 'var(--color-peach)',
  'lime-green': 'var(--color-lime)',
};

const catEmojiMap: Record<string, string> = {
  text: '📝', language: '🌐', finance: '💰', datetime: '📅',
  convert: '🔄', image: '🖼', life: '🏠', devtools: '💻',
  codec: '🔐', network: '🌍',
};

function ToolCard({
  tool,
  onClick,
  extra,
}: {
  tool: ToolEntry;
  onClick: () => void;
  extra?: ReactNode;
}) {
  return (
    <div
      key={tool.id}
      style={{ ...toolCardStyle, position: 'relative' }}
      className="magnetic"
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
        (e.target as HTMLElement).style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        (e.target as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        {tool.name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
        {tool.description}
      </div>
      {extra}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const history = useAppStore((s) => s.history);
  const favorites = useAppStore((s) => s.favorites);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const getDynamicPopularTools = useCallback((limit: number): ToolEntry[] => {
    const basePopular = getPopularTools(100);
    const historyMap = new Map<string, number>();
    const favoritesMap = new Map<string, number>();

    history.forEach((id) => {
      historyMap.set(id, (historyMap.get(id) || 0) + 1);
    });
    favorites.forEach((id) => {
      favoritesMap.set(id, (favoritesMap.get(id) || 0) + 1);
    });

    const scored = basePopular.map((tool) => {
      const baseScore = tool.popularity * 0.7;
      const historyScore = (historyMap.get(tool.id) || 0) * 5;
      const favScore = (favoritesMap.get(tool.id) || 0) * 10;
      return { tool, score: baseScore + historyScore + favScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.tool);
  }, [history, favorites]);

  const dynamicPopularTools = useMemo(() => getDynamicPopularTools(12), [getDynamicPopularTools]);

  // History tools (first 10)
  const historyTools = useMemo(() => {
    const seen = new Set<string>();
    return history
      .map((id) => getToolById(id))
      .filter((t): t is ToolEntry => {
        if (!t || seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      })
      .slice(0, 10);
  }, [history]);

  // Favorite tools
  const favoriteTools = useMemo(() => {
    return favorites
      .map((id) => getToolById(id))
      .filter((t): t is ToolEntry => !!t);
  }, [favorites]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    showToast('历史记录已清空', 'info');
  }, [clearHistory]);

  const handleRemoveFav = useCallback(
    (e: React.MouseEvent, toolId: string) => {
      e.stopPropagation();
      removeFavorite(toolId);
      showToast('已取消收藏', 'info');
    },
    [removeFavorite],
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>{SITE_NAME}</h1>
        <p style={heroSubStyle}>
          一站式综合在线效率工具平台。10 大分类，110+ 工具，无需下载安装，打开即用。
        </p>
      </div>

      {/* Recent History */}
      {historyTools.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={sectionHeaderStyle}>
            <Title size="large" color="app-teal">最近使用</Title>
            <button
              style={clearBtnStyle}
              onClick={handleClearHistory}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = 'var(--color-red)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              清空记录
            </button>
          </div>
          <Suspense fallback={<SectionFallback count={6} />}>
            <div style={popularGridStyle}>
              {historyTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => navigate(`/tool/${tool.id}`)}
                />
              ))}
            </div>
          </Suspense>
        </div>
      )}

      {/* Categories */}
      <Title size="large" color="app-blue">工具分类</Title>
      <div style={categoryGridStyle}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            style={catCardStyle}
            className="magnetic"
            onClick={() => navigate(`/category/${cat.slug}`)}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-4px)';
              (e.target as HTMLElement).style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={catDotStyle(colorMap[cat.color] || 'var(--color-blue)')}>
              <span style={{ fontSize: 20 }}>{catEmojiMap[cat.slug] || '📦'}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {cat.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {cat.description}
            </div>
          </div>
        ))}
      </div>

      {/* Favorites */}
      {favoriteTools.length > 0 && (
        <div style={sectionStyle}>
          <Title size="large" color="app-yellow">我的收藏</Title>
          <div style={popularGridStyle}>
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => navigate(`/tool/${tool.id}`)}
                extra={
                  <button
                    style={removeFavBtnStyle}
                    onClick={(e) => handleRemoveFav(e, tool.id)}
                    onMouseEnter={(e2) => {
                      (e2.target as HTMLElement).style.color = 'var(--color-red)';
                    }}
                    onMouseLeave={(e2) => {
                      (e2.target as HTMLElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    ✕
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Tools (dynamic) */}
      <div style={sectionStyle}>
        <Title size="large" color="app-yellow">热门工具</Title>
        <Suspense fallback={<SectionFallback count={12} />}>
          <div style={popularGridStyle}>
            {dynamicPopularTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => navigate(`/tool/${tool.id}`)}
              />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
