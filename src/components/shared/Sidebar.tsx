import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { useResponsive } from '../../hooks';
import { CATEGORIES, type CategorySlug } from '../../lib/tool-registry';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.3)',
  zIndex: 150,
  display: 'none',
};

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 'var(--header-height)',
  left: 0,
  bottom: 0,
  width: 'var(--nav-width)',
  background: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border-light)',
  zIndex: 160,
  overflowY: 'auto',
  padding: '12px 8px',
  transition: 'transform var(--transition-normal), background-color var(--transition-normal)',
};

const categoryItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 14px',
  borderRadius: 12,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-primary)',
  transition: 'all var(--transition-fast)',
  border: 'none',
  background: 'transparent',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'var(--font-sans)',
};

const categoryItemActiveStyle: React.CSSProperties = {
  ...categoryItemStyle,
  background: 'var(--bg-primary)',
  boxShadow: 'var(--shadow-sm)',
};

const favItemStyle: React.CSSProperties = {
  ...categoryItemStyle,
  color: 'var(--color-yellow)',
};

const favBadgeStyle: React.CSSProperties = {
  background: 'var(--color-yellow)',
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 7px',
  borderRadius: 10,
  minWidth: 20,
  textAlign: 'center',
  lineHeight: '16px',
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  background: 'var(--border-light)',
  margin: '8px 12px',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const favorites = useAppStore((s) => s.favorites);
  const { isMobile } = useResponsive();

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = '';
    }
    return () => {
      document.body.style.overflowX = '';
    };
  }, [isMobile, sidebarOpen]);

  const currentSlug = location.pathname.startsWith('/category/')
    ? location.pathname.split('/category/')[1]
    : null;

  const handleCategoryClick = (slug: CategorySlug) => {
    navigate(`/category/${slug}`);
    setSidebarOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setSidebarOpen(false);
  };

  const handleFavClick = () => {
    navigate('/');
    setSidebarOpen(false);
  };

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

  // Mobile overlay
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={{ ...overlayStyle, display: 'block' }}
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <nav
        style={{
          ...navStyle,
          transform: isMobile
            ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
        }}
        className="sidebar"
      >
        {/* Home */}
        <button
          style={location.pathname === '/' ? categoryItemActiveStyle : categoryItemStyle}
          onClick={handleHomeClick}
          onMouseEnter={(e) => {
            if (location.pathname !== '/') {
              (e.target as HTMLElement).style.background = 'var(--bg-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/') {
              (e.target as HTMLElement).style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: 18 }}>🏠</span>
          <span>首页</span>
        </button>

        <div style={dividerStyle} />

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const isActive = currentSlug === cat.slug;
          const dotColor = colorMap[cat.color] || 'var(--text-muted)';
          return (
            <button
              key={cat.slug}
              style={isActive ? categoryItemActiveStyle : categoryItemStyle}
              onClick={() => handleCategoryClick(cat.slug)}
              onMouseEnter={(e) => {
                if (!isActive) (e.target as HTMLElement).style.background = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                }}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* Favorites */}
        {favorites.length > 0 && (
          <>
            <div style={dividerStyle} />
            <button
              style={location.pathname === '/' ? favItemStyle : categoryItemStyle}
              onClick={handleFavClick}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/') {
                  (e.target as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 14 }}>⭐</span>
              <span>我的收藏</span>
              <span style={favBadgeStyle}>{favorites.length}</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
