import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/login/LoginPage.tsx'
import { ProductsPage } from './pages/products/ProductsPage.tsx'
import { RequireAuth } from './shared/auth/RequireAuth.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}
