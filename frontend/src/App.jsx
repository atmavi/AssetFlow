import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import AssetDetailsPage from "./pages/AssetDetailsPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/assets/:id" element={<AssetDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
