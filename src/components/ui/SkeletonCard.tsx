const skeletonCardStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: 16,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-card)',
  width: '100%',
  minHeight: 80,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const shimmerBase: React.CSSProperties = {
  background: 'linear-gradient(90deg, var(--border-light) 25%, var(--bg-secondary) 50%, var(--border-light) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 6,
};

const nameBarStyle: React.CSSProperties = {
  ...shimmerBase,
  height: 16,
  width: '60%',
};

const descBarStyle: React.CSSProperties = {
  ...shimmerBase,
  height: 12,
  width: '85%',
};

const descBarShortStyle: React.CSSProperties = {
  ...shimmerBase,
  height: 12,
  width: '45%',
};

export default function SkeletonCard() {
  return (
    <div style={skeletonCardStyle}>
      <div style={nameBarStyle} />
      <div style={descBarStyle} />
      <div style={descBarShortStyle} />
    </div>
  );
}
