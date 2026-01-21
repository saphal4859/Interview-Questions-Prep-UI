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

  if (!data) return null;

  return (
    <div className="min-h-screen bg-white px-10 py-8">
      {/* Header */}
      <HomeButton></HomeButton>
      <h1 className="text-2xl text-center font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* Summary */}
      <div className="flex gap-6 mb-8">
        <SummaryCard label="Categories" value={data.summary.totalCategories} />
        <SummaryCard label="Sub Categories" value={data.summary.totalSubCategories} />
        <SummaryCard label="Questions" value={data.summary.totalQuestions} />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-sm text-gray-500 bg-gray-50">
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
    <div className="flex-1 border rounded-xl px-6 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
