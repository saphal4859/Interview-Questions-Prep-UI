import { BrowserRouter, Routes, Route } from "react-router-dom";
import SessionPage from "./pages/SessionPage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://interview-questions-prep.onrender.com/health-check").catch(
        () => {}
      );
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
