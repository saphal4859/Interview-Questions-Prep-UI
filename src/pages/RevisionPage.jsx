import { useEffect, useState, useMemo } from "react";
import { api } from "../api/api";
import TopFilterBar from "../components/TopFilterBar";
import QuestionBlock from "../components/QuestionBlock";
import AddQuestionDrawer from "../components/AddQuestionDrawer";

export default function RevisionPage() {
  // 🔹 Metadata
  const [meta, setMeta] = useState({
    categories: [],
    subCategories: {},
    difficulties: [],
  });
  const [totalCount, setTotalCount] = useState(0);

  // 🔹 Filters
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  // 🔹 Shuffle
  const [shuffle, setShuffle] = useState(true);

  // 🔹 Session
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // 🔹 Pagination
  const [page, setPage] = useState(0);

  // 🔹 UI
  const [loading, setLoading] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // 🔹 SORT STATE
  const [sortOrder, setSortOrder] = useState("desc"); // default newest first

  // 🔹 Load metadata
  useEffect(() => {
    api.get("/api/metadata/filters").then((res) => setMeta(res.data));
  }, []);

  const handleEdit = (question) => {
    setExpandAll(false);
    setEditingQuestion(question);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // 🔹 Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const resolvedCategories =
        categories.length > 0 ? categories : meta.categories;

      const resolvedSubCategories =
        subCategories.length > 0
          ? subCategories
          : resolvedCategories.flatMap((c) => meta.subCategories[c] || []);

      const resolvedDifficulties =
        difficulties.length > 0 ? difficulties : meta.difficulties;

      const res = await api.post("/api/sessions/start", {
        categories: resolvedCategories,
        subCategories: resolvedSubCategories,
        difficulties: resolvedDifficulties,
        shuffle,
      });

      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setTotalCount(res.data.totalCount);

      setPage(0);
      setExpandAll(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch next batch
  const fetchNext = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);

      const res = await api.post("/api/sessions/next", {
        sessionId,
      });

      if (!res.data.completed) {
        setQuestions(res.data.questions);
        setPage((prev) => prev + 1);
        setExpandAll(false);

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SORTED QUESTIONS (memoized for performance)
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }, [questions, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 🔹 FILTER BAR */}
      <TopFilterBar
        title="Revision Mode"
        meta={meta}
        categories={categories}
        setCategories={setCategories}
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        difficulties={difficulties}
        setDifficulties={setDifficulties}
        onStart={fetchQuestions}
        hasActiveSession={false}
        loading={loading}
        shuffle={shuffle}
        setShuffle={setShuffle}
        onAddQuestion={null}
      />

      {/* 🔹 MAIN */}
      <div className="w-full max-w-[1100px] xl:max-w-[1300px] mx-auto px-6 py-6">
        {/* 🔹 HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Revision Mode
          </h1>

          {questions.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Expand */}
              <button
                onClick={() => setExpandAll((prev) => !prev)}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm"
              >
                {expandAll ? "Collapse All" : "Expand All"}
              </button>

              {/* Sort */}
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
              </button>
            </div>
          )}
        </div>

        {/* 🔹 COUNT */}
        {questions.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <b>{page * 50 + 1}</b> –{" "}
            <b>{page * 50 + questions.length}</b> of <b>{totalCount}</b>{" "}
            questions
          </p>
        )}

        {/* 🔹 LOADING */}
        {loading && (
          <div className="text-center py-6 text-gray-500">
            Fetching questions...
          </div>
        )}

        {/* 🔹 EMPTY */}
        {!loading && questions.length === 0 && (
          <p className="text-center text-gray-400">
            Select filters and click Start
          </p>
        )}

        {/* 🔹 QUESTIONS */}
        {questions.length > 0 && (
          <div className="bg-white border rounded-xl shadow-sm px-4 divide-y">
            {sortedQuestions.map((q, index) => {
              const displayIndex =
                sortOrder === "asc"
                  ? index
                  : sortedQuestions.length - index - 1;

              return (
                <QuestionBlock
                  key={q.id}
                  q={q}
                  index={displayIndex}
                  expandAll={expandAll}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
        {/* 🔹 NEXT BUTTON */}
        {questions.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={fetchNext}
              disabled={!sessionId || loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Next 50 Questions →
            </button>
          </div>
        )}

        {/* 🔹 DRAWER */}
        <AddQuestionDrawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingQuestion(null);
          }}
          meta={meta}
          editingQuestion={editingQuestion}
          onQuestionUpdated={(updatedQuestion) => {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q,
              ),
            );
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
