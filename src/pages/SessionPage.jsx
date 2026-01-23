import { useEffect, useState } from "react";
import { api } from "../api/api";
import TopFilterBar from "../components/TopFilterBar";
import QuestionCard from "../components/QuestionCard";
import NavigationControls from "../components/NavigationControls";
import SessionSummary from "../components/SessionSummary";
import AddQuestionDrawer from "../components/AddQuestionDrawer";
import EmptyState from "../components/EmptyState";

export default function SessionPage() {
  // metadata
  const [meta, setMeta] = useState({
    categories: [],
    subCategories: {},
    difficulties: [],
  });

  // filters
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  // session
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // progress
  const [targetCount, setTargetCount] = useState(0);
  const [achievedSet, setAchievedSet] = useState(new Set());
  const achievedCount = achievedSet.size;

  // session end
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  // loading
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  // timer
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // add question drawer
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const isSessionComplete =
    targetCount > 0 && (achievedCount === targetCount || isSessionEnded);
  const [autoShowAnswer, setAutoShowAnswer] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [shuffle, setShuffle] = useState(true); // default ON

  // load metadata
  useEffect(() => {
    api.get("/api/metadata/filters").then((res) => setMeta(res.data));
  }, []);

  // timer tick
  useEffect(() => {
    if (!startTime || isSessionComplete) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isSessionComplete]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setShowAnswer(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const startSession = async () => {
    const resolvedCategories =
      categories.length > 0 ? categories : meta.categories;

    const resolvedSubCategories =
      subCategories.length > 0
        ? subCategories
        : resolvedCategories.flatMap((c) => meta.subCategories[c] || []);

    const resolvedDifficulties =
      difficulties.length > 0 ? difficulties : meta.difficulties;

    setLoading(true);

    const res = await api.post("/api/sessions/start", {
      categories: resolvedCategories,
      subCategories: resolvedSubCategories,
      difficulties: resolvedDifficulties,
      shuffle,
    });

    setSessionId(res.data.sessionId);
    setQuestions(res.data.questions);
    setCurrentIndex(0);
    setShowAnswer(false);
    setTargetCount(res.data.totalCount);
    setAchievedSet(new Set());
    setIsSessionEnded(false);
    setStartTime(Date.now());
    setElapsed(0);

    setLoading(false);
  };

  const endSession = () => {
    markAchieved(currentIndex);
    setIsSessionEnded(true);
  };

  const fetchNext = async () => {
    if (!sessionId || loadingNext) return;

    setLoadingNext(true);
    const res = await api.post("/api/sessions/next", { sessionId });

    if (!res.data.completed) {
      setQuestions((prev) => [...prev, ...res.data.questions]);
    }

    setLoadingNext(false);
  };

  const markAchieved = (index) => {
    setAchievedSet((prev) => {
      if (prev.has(index)) return prev;
      const updated = new Set(prev);
      updated.add(index);
      return updated;
    });
  };

  const next = () => {
    markAchieved(currentIndex);
    if (currentIndex >= questions.length - 1) return;

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (!autoShowAnswer) {
      setShowAnswer(false);
    }

    if (nextIndex >= questions.length - 2) fetchNext();
  };

  const prev = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    if (!autoShowAnswer) {
      setShowAnswer(false);
    }
  };

  return (
    <>
      <TopFilterBar
        meta={meta}
        categories={categories}
        setCategories={setCategories}
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        difficulties={difficulties}
        setDifficulties={setDifficulties}
        onStart={startSession}
        onEndSession={endSession}
        hasActiveSession={!!sessionId && !isSessionComplete}
        loading={loading}
        onAddQuestion={() => setShowAddDrawer(true)}
        shuffle={shuffle}
  setShuffle={setShuffle}
      />

      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-6">
          {/* TIMER */}
          {sessionId && !isSessionComplete && (
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Interview Practice Session
              </span>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <span className="text-gray-600">Auto show answers</span>
                <input
                  type="checkbox"
                  checked={autoShowAnswer}
                  onChange={(e) => setAutoShowAnswer(e.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>
            </div>
          )}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            {/* 1️⃣ EMPTY STATE */}
            {!sessionId && <EmptyState />}

            {/* 2️⃣ SESSION RUNNING */}
            {sessionId && !isSessionComplete && (
              <>
                <QuestionCard
                  question={questions[currentIndex]}
                  currentIndex={currentIndex}
                  totalCount={targetCount}
                  showAnswer={showAnswer}
                  autoShowAnswer={autoShowAnswer}
                  onShowAnswer={() => setShowAnswer(true)}
                  achievedCount={achievedCount}
                  onEdit={(q) => {
                    setEditingQuestion(q);
                    setShowAddDrawer(true);
                  }}
                />

                <NavigationControls
                  onPrev={prev}
                  onNext={next}
                  disablePrev={currentIndex === 0}
                />

                {loadingNext && (
                  <p className="text-sm text-gray-500 mt-4">
                    Loading more questions…
                  </p>
                )}
              </>
            )}

            {/* 3️⃣ SESSION COMPLETE */}
            {isSessionComplete && (
              <SessionSummary
                targetCount={targetCount}
                achievedCount={achievedCount}
                totalTime={elapsed}
                onRestart={() => window.location.reload()}
              />
            )}
          </div>
        </div>
      </div>

      <AddQuestionDrawer
        open={showAddDrawer}
        onClose={() => {
          setShowAddDrawer(false);
          setEditingQuestion(null);
        }}
        meta={meta}
        editingQuestion={editingQuestion}
        onQuestionUpdated={(updated) => {
          setQuestions((prev) =>
            prev.map((q) => (q.id === updated.id ? updated : q)),
          );
        }}
        presetFilters={{
          category: categories[0],
          subCategory: subCategories[0],
          difficulty: difficulties[0],
        }}
      />
    </>
  );
}
