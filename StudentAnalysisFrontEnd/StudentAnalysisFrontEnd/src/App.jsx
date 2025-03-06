import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import ReportsPage from "./pages/ReportsPage";
import MarksUploadPage from "./pages/MarksUploadPage";
import MarksUpdatePage from "./pages/MarksUpdatePage";
import StudentUploadPage from "./pages/StudentUploadPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagementPage from "./pages/UserManagementPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import BatchManagementPage from "./pages/BatchManagementPage";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import RankingPage from "./pages/RankingPage";
import MarksheetPage from "./pages/MarksheetPage";
import RankingHistoryPage from "./pages/RankingHistoryPage";
import ScoreManagementPage from "./pages/ScoreManagementPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/students" element={<StudentManagementPage />} />
            <Route path="/batches" element={<BatchManagementPage />} />
            <Route path="/subjects" element={<SubjectManagementPage />} />
            <Route path="/rankings" element={<RankingPage />} />
            <Route path="/score-management" element={<ScoreManagementPage />} />
            <Route path="/ranking-history" element={<RankingHistoryPage />} />
          </Route>

          {/* General Protected Routes */}
          <Route
            element={<ProtectedRoute requiredRole={["ADMIN", "TEACHER"]} />}
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/students/upload" element={<StudentUploadPage />} />
            <Route path="/marks/upload" element={<MarksUploadPage />} />
            <Route path="/marks/update" element={<MarksUpdatePage />} />
            <Route path="/marksheet" element={<MarksheetPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
