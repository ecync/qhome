import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { Login } from "./components/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";
import { Analytics } from "./components/Analytics";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuth = sessionStorage.getItem('username') && sessionStorage.getItem('password');
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        }>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
