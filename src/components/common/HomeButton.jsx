import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-6 left-6 z-50
                 flex items-center gap-2
                 bg-slate-900/80 backdrop-blur
                 border border-slate-700
                 px-4 py-2 rounded-xl
                 text-slate-200 hover:text-white
                 hover:border-indigo-500
                 transition shadow-lg"
    >
      <Home size={18} />
      <span className="text-sm font-medium">Home</span>
    </button>
  );
}
