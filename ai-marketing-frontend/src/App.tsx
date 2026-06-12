import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastViewport } from './components/ui/ToastViewport';
import { ContentDetailsPage } from './pages/ContentDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { GenerateContentPage } from './pages/GenerateContentPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<Navigate replace to="/dashboard" />} path="/" />
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<GenerateContentPage />} path="/generate" />
            <Route element={<ResultsPage />} path="/results" />
            <Route element={<HistoryPage />} path="/history" />
            <Route element={<ContentDetailsPage />} path="/content/:id" />
            <Route element={<ProfilePage />} path="/profile" />
          </Route>
        </Route>

        <Route element={<NotFoundPage />} path="*" />
      </Routes>
      <ToastViewport />
    </>
  );
}
