import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import SessionPage from "./pages/SessionPage";
import DashboardPage from "./pages/DashboardPage";
import LottieLoader from "./components/LottieLoader";

export default function App() {
  const [loading, setLoading] = useState(true);

  // 🔹 Keep Render backend warm
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch("https://interview-questions-prep.onrender.com/health-check").catch(
  //       () => {}
  //     );
  //   }, 5 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // 🔹 Initial page load loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LottieLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
