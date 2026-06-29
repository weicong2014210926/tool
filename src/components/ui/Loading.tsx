const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 300,
  flexDirection: 'column',
  gap: 16,
};

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  border: '3px solid var(--border-light)',
  borderTopColor: 'var(--color-blue)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const textStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
};

export function LoadingScreen() {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <span style={textStyle}>加载中...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '2px solid var(--border-light)',
        borderTopColor: 'var(--color-blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}
