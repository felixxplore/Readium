// routes/AppRoutes.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: any) {
  const { isAuthenticated, loading } = useSelector((state: any) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
