import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';
import Sidebar from '../components/shared/Sidebar';
import { LoadingScreen } from '../components/ui/Loading';
import { useResponsive } from '../hooks';

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const bodyStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: 'var(--nav-width)',
  padding: '24px 32px',
  minHeight: 'calc(100vh - var(--header-height))',
  background: 'var(--bg-primary)',
  transition: 'background-color var(--transition-normal)',
  overflow: 'auto',
};

const mobileContentStyle: React.CSSProperties = {
  ...contentStyle,
  marginLeft: 0,
  padding: '16px',
};

export default function MainLayout() {
  const { isMobile } = useResponsive();

  return (
    <div style={layoutStyle}>
      <Header />
      <div style={bodyStyle}>
        <Sidebar />
        <main style={isMobile ? mobileContentStyle : contentStyle}>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
