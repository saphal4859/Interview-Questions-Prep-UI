import { useEffect, useState } from "react";
import { api } from "../api/api";
import TopFilterBar from "../components/TopFilterBar";
import QuestionBlock from "../components/QuestionBlock";

export default function RevisionPage() {
  // 🔹 Metadata
  const [meta, setMeta] = useState({
    categories: [],
    subCategories: {},
    difficulties: [],
  });

  // 🔹 Filters
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  // 🔹 Shuffle
  const [shuffle, setShuffle] = useState(true);

  // 🔹 Session
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // 🔹 Pagination (IMPORTANT FIX)
  const [page, setPage] = useState(0);

  // 🔹 UI
  const [loading, setLoading] = useState(false);

  // 🔹 Load metadata
  useEffect(() => {
    api.get("/api/metadata/filters").then((res) => setMeta(res.data));
  }, []);

  // 🔹 Start Session
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const resolvedCategories =
        categories.length > 0 ? categories : meta.categories;

      const resolvedSubCategories =
        subCategories.length > 0
          ? subCategories
          : resolvedCategories.flatMap(
              (c) => meta.subCategories[c] || []
            );

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

      // ✅ Reset page
      setPage(0);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Next 50 Questions
  const fetchNext = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);

      const res = await api.post("/api/sessions/next", {
        sessionId,
      });

      if (!res.data.completed) {
        setQuestions(res.data.questions);

        // ✅ Increment page
        setPage((prev) => prev + 1);

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* 🔹 FILTER BAR */}
      <TopFilterBar
        title="Revision Mode"   // ✅ THIS SHOWS TITLE
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
        onAddQuestion={null} // ❌ removed
      />

      {/* 🔹 MAIN CONTAINER */}
      <div className="w-full max-w-[1100px] xl:max-w-[1300px] mx-auto px-6 py-6">

        {/* 🔹 HEADER */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Revision Mode
        </h1>

        {questions.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Showing {page * 50 + 1} – {page * 50 + questions.length}
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

            {questions.map((q, index) => (
              <QuestionBlock
                key={q.id}
                q={q}
                index={page * 50 + index} // ✅ FIXED NUMBERING
              />
            ))}

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
      </div>
    </div>
  );
}