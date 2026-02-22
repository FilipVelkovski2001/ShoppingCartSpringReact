import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/products" replace />;
};

const AppContent = (): React.JSX.Element => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-cream-100">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        <Routes>
          <Route path="/login"        element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"     element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/products"     element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
          <Route path="/cart"         element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*"             element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        toastClassName="shadow-elevated"
      />
    </div>
  );
};

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
