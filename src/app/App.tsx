import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import { ToastContainer } from '../components/ui/Toast';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  );
}
