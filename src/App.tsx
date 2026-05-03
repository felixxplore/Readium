// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Username from "./pages/Username";
import { ProtectedRoute } from "./routes/AppRoutes";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { initializeAuth } from "./features/auth/authThunks";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth()); // very important
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/username" element={<Username />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div>Home Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
