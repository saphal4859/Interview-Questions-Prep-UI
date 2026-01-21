import MultiSelect from "./MultiSelect";

export default function TopFilterBar({
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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-4 py-2 rounded-md text-sm
             bg-gradient-to-r from-indigo-500 to-purple-600
             text-white hover:opacity-90"
        >
          📊 Dashboard
        </button>
        <MultiSelect
          options={categoryOptions}
          value={categories.map((c) => ({ label: c, value: c }))}
          onChange={(vals) => {
            setCategories(vals.map((v) => v.value));
            setSubCategories([]);
          }}
          placeholder="Category"
        />

        <MultiSelect
          options={subCategoryOptions}
          value={subCategories.map((s) => ({ label: s, value: s }))}
          onChange={(vals) => setSubCategories(vals.map((v) => v.value))}
          placeholder="Subcategory"
          isDisabled={categories.length === 0}
        />

        <MultiSelect
          options={difficultyOptions}
          value={difficulties.map((d) => ({ label: d, value: d }))}
          onChange={(vals) => setDifficulties(vals.map((v) => v.value))}
          placeholder="Difficulty"
        />

        <div className="ml-auto flex gap-2">
          <button
            onClick={onAddQuestion}
            className="px-4 py-2 rounded-md text-sm border hover:bg-gray-100"
          >
            ➕ Add Question
          </button>

          {!hasActiveSession && (
            <button
              onClick={onStart}
              disabled={loading}
              className="px-5 py-2 rounded-md text-sm font-medium
                         bg-indigo-600 text-white
                         hover:bg-indigo-700
                         disabled:opacity-40"
            >
              {loading ? "Starting…" : "Start"}
            </button>
          )}

          {hasActiveSession && (
            <button
              onClick={onEndSession}
              className="px-5 py-2 rounded-md text-sm font-medium
                         bg-red-500 text-white
                         hover:bg-red-600"
            >
              End Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
