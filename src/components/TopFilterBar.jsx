import MultiSelect from "./MultiSelect";
import ToggleSwitch from "./ToggleSwitch";
import { Link, useLocation } from "react-router-dom";

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
  showFilters = true,
}) {
  const location = useLocation();

  const categoryOptions =
    meta?.categories?.map((c) => ({
      label: c.replaceAll("_", " "),
      value: c,
    })) || [];

  const subCategoryOptions = categories?.length
    ? Array.from(
        new Set(categories.flatMap((cat) => meta?.subCategories?.[cat] || [])),
      ).map((sc) => ({
        label: sc.replaceAll("_", " "),
        value: sc,
      }))
    : [];

  const difficultyOptions =
    meta?.difficulties?.map((d) => ({
      label: d,
      value: d,
    })) || [];

  const navClass = (path) =>
    `flex items-center gap-1 transition whitespace-nowrap ${
      location.pathname === path
        ? "text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-3 py-2 text-sm">
        {/* 🔥 NAVBAR */}
        <div className="flex items-center gap-4 text-sm font-medium whitespace-nowrap overflow-x-auto">
          <Link to="/" className={navClass("/")}>
            🏠 <span className="hidden sm:inline">Home</span>
          </Link>

          <Link to="/dashboard" className={navClass("/dashboard")}>
            📊 <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link to="/revision" className={navClass("/revision")}>
            📘 <span className="hidden sm:inline">Revision</span>
          </Link>

          <Link to="/notes" className={navClass("/notes")}>
            📝 <span className="hidden sm:inline">Notes</span>
          </Link>
        </div>

        {/* 🔹 FILTER SECTION */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* FILTERS */}
            <div className="flex flex-wrap gap-2 flex-1 min-w-0">
              <MultiSelect
                options={categoryOptions}
                value={categories.map((c) => ({
                  label: c,
                  value: c,
                }))}
                onChange={(vals) => {
                  setCategories(vals.map((v) => v.value));
                  setSubCategories([]);
                }}
                placeholder="Category"
                className="min-w-[120px] flex-1"
              />

              <MultiSelect
                options={subCategoryOptions}
                value={subCategories.map((s) => ({
                  label: s,
                  value: s,
                }))}
                onChange={(vals) => setSubCategories(vals.map((v) => v.value))}
                placeholder="Subcategory"
                isDisabled={categories.length === 0}
                className="min-w-[120px] flex-1"
              />

              <MultiSelect
                options={difficultyOptions}
                value={difficulties.map((d) => ({
                  label: d,
                  value: d,
                }))}
                onChange={(vals) => setDifficulties(vals.map((v) => v.value))}
                placeholder="Difficulty"
                className="min-w-[100px] flex-1"
              />
            </div>

            {/* SHUFFLE */}
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-xs text-gray-500">Shuffle</span>

              <ToggleSwitch
                checked={shuffle}
                disabled={hasActiveSession}
                onChange={setShuffle}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 items-center w-full sm:w-auto sm:ml-auto justify-end">
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
                  className="
                    px-4 py-1.5 text-xs rounded-md font-medium
                    bg-indigo-600 text-white
                    hover:bg-indigo-700
                    disabled:opacity-40 whitespace-nowrap
                  "
                >
                  {loading ? "Starting…" : "Start"}
                </button>
              )}

              {hasActiveSession && (
                <button
                  onClick={onEndSession}
                  className="
                    px-4 py-1.5 text-xs rounded-md font-medium
                    bg-red-500 text-white
                    hover:bg-red-600 whitespace-nowrap
                  "
                >
                  End
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
