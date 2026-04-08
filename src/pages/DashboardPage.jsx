import { useEffect, useState } from "react";
import CategoryRow from "../components/dashboard/CategoryRows";
import HomeButton from "../components/common/HomeButton";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/overview`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // ✅ Loading State
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-12 py-10">
      {/* Header */}
      <div className="relative mb-8 flex items-center">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="ml-auto">
          <HomeButton />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard label="Categories" value={data.summary.totalCategories} />
        <SummaryCard
          label="Sub Categories"
          value={data.summary.totalSubCategories}
        />
        <SummaryCard label="Questions" value={data.summary.totalQuestions} />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-12 px-6 py-4 text-xs font-semibold text-gray-500 uppercase bg-gray-100">
          <div className="col-span-6">Category</div>
          <div className="col-span-3 text-center">Sub Topics</div>
          <div className="col-span-3 text-center">Questions</div>
        </div>

        {data.categories.map((cat) => (
          <CategoryRow key={cat.category} category={cat} />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white shadow-md rounded-2xl px-6 py-5 hover:shadow-lg transition-all">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
