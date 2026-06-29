import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES, getToolsByCategory, type CategorySlug } from '../../lib/tool-registry';
import { Title } from 'animal-island-ui';

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 14,
};

const toolCardStyle: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: 16,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  cursor: 'pointer',
  transition: 'all var(--transition-slow)',
};

const notFoundStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 60,
  color: 'var(--text-muted)',
  fontSize: 16,
  fontFamily: 'var(--font-sans)',
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    return <div style={notFoundStyle}>分类不存在</div>;
  }

  const tools = getToolsByCategory(slug as CategorySlug);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <Title size="large" color={category.color as any}>
          {category.name}
        </Title>
        <p style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          marginTop: 8,
          fontFamily: 'var(--font-sans)',
        }}>
          {category.description} — 共 {tools.length} 个工具
        </p>
      </div>

      <div style={gridStyle}>
        {tools.map((tool) => (
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
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {tool.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
