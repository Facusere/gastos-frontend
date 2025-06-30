import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import MonthlyReport from '../pages/MonthlyReport';
import NewExpense from '../pages/NewExpense';
import Profile from '../pages/Profile';
import Layout from '../layouts/Layout';
import PrivateRoute from './PrivateRoute';
import ExpensesList from '../pages/ExpensesList';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<MonthlyReport />} />
            <Route path="/new-expense" element={<NewExpense />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expenses" element={<ExpensesList />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
