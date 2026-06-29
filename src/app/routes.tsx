import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HomePage = lazy(() => import('../features/home/HomePage'));
const CategoryPage = lazy(() => import('../features/category/CategoryPage'));
const ToolPage = lazy(() => import('../features/tools/ToolPage'));
const SearchPage = lazy(() => import('../features/search/SearchPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'tool/:toolId', element: <ToolPage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
]);
