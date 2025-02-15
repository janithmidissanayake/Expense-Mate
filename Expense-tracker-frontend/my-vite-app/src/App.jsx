

import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import ProtectedRoute from "./context/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/Register";
import SignIn from "./pages/SignIn";
import Helloworld from "./pages/Helloworld";
import {AuthProvider}  from './context/AuthProvider';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import CategoryPage from "./pages/CategoryPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<SignIn />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="hello" element={<Helloworld />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="income" element={<Income  />} />
          <Route path="income" element={<Income  />} />
          <Route path="expense" element={<Expense />} />
          <Route path="category" element={<CategoryPage />} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;
