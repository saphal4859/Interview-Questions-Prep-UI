export default function SummaryCards({ summary }) {
  const cards = [
    { label: "Categories", value: summary.totalCategories },
    { label: "Sub Categories", value: summary.totalSubCategories },
    { label: "Questions", value: summary.totalQuestions },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6
                     hover:border-indigo-500 transition"
        >
          <div className="text-slate-400 text-sm">{c.label}</div>
          <div className="text-4xl font-bold mt-2">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
