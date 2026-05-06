import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import SessionPage from "./pages/SessionPage";
import DashboardPage from "./pages/DashboardPage";
import RevisionPage from "./pages/RevisionPage";
import NotesPage from "./pages/NotesPage";
import LottieLoader from "./components/LottieLoader";
import { Toaster } from "react-hot-toast";
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "13px",
            borderRadius: "8px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<SessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/revision" element={<RevisionPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
