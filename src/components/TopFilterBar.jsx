import MultiSelect from "./MultiSelect";
import ToggleSwitch from "./ToggleSwitch";
import { Link } from "react-router-dom";

export default function TopFilterBar({
  title = "Session",
  meta,
  categories,
  setCategories,
  subCategories,
  setSubCategories,
  difficulties,
  setDifficulties,
  onStart,
  onEndSession,
  hasActiveSession,
  loading,
  onAddQuestion,
  shuffle,
  setShuffle,
}) {
  const categoryOptions = meta.categories.map((c) => ({
    label: c.replaceAll("_", " "),
    value: c,
  }));

  const subCategoryOptions = categories.length
    ? Array.from(
        new Set(categories.flatMap((cat) => meta.subCategories[cat] || [])),
      ).map((sc) => ({
        label: sc.replaceAll("_", " "),
        value: sc,
      }))
    : [];

  const difficultyOptions = meta.difficulties.map((d) => ({
    label: d,
    value: d,
  }));

  return (
    <div className="sticky top-0 z-40 bg-white border-b">
  <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 text-sm">

    {/* 🔥 NAVBAR */}
    <div className="flex items-center gap-3 mr-2 text-sm font-medium whitespace-nowrap">
      <Link to="/" className="text-gray-600 hover:text-black flex items-center gap-1">
        🏠 <span className="hidden sm:inline">Home</span>
      </Link>

      <Link to="/dashboard" className="text-gray-600 hover:text-black flex items-center gap-1">
        📊 <span className="hidden sm:inline">Dashboard</span>
      </Link>

      <Link to="/revision" className="text-gray-600 hover:text-black flex items-center gap-1">
        📘 <span className="hidden sm:inline">Revision</span>
      </Link>
    </div>

    {/* 🔹 FILTERS */}
    <MultiSelect
      options={categoryOptions}
      value={categories.map((c) => ({ label: c, value: c }))}
      onChange={(vals) => {
        setCategories(vals.map((v) => v.value));
        setSubCategories([]);
      }}
      placeholder="Category"
      className="min-w-[140px]"
    />

    <MultiSelect
      options={subCategoryOptions}
      value={subCategories.map((s) => ({ label: s, value: s }))}
      onChange={(vals) => setSubCategories(vals.map((v) => v.value))}
      placeholder="Subcategory"
      isDisabled={categories.length === 0}
      className="min-w-[140px]"
    />

    <MultiSelect
      options={difficultyOptions}
      value={difficulties.map((d) => ({ label: d, value: d }))}
      onChange={(vals) => setDifficulties(vals.map((v) => v.value))}
      placeholder="Difficulty"
      className="min-w-[120px]"
    />

    {/* 🔹 SHUFFLE */}
    <div className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-xs text-gray-500">Shuffle</span>
      <ToggleSwitch
        checked={shuffle}
        disabled={hasActiveSession}
        onChange={setShuffle}
      />
    </div>

    {/* 🔹 ACTIONS */}
    <div className="ml-auto flex gap-2 items-center">

      {onAddQuestion && (
        <button
          onClick={onAddQuestion}
          className="px-3 py-1.5 text-xs rounded-md border hover:bg-gray-100 whitespace-nowrap"
        >
          ➕ Add
        </button>
      )}

      {!hasActiveSession && (
        <button
          onClick={onStart}
          disabled={loading}
          className="px-4 py-1.5 text-xs rounded-md font-medium
                     bg-indigo-600 text-white
                     hover:bg-indigo-700
                     disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? "Starting…" : "Start"}
        </button>
      )}

      {hasActiveSession && (
        <button
          onClick={onEndSession}
          className="px-4 py-1.5 text-xs rounded-md font-medium
                     bg-red-500 text-white
                     hover:bg-red-600 whitespace-nowrap"
        >
          End
        </button>
      )}
    </div>
  </div>
</div>
  );
}