import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import confetti from "canvas-confetti";
import { api } from "../api/api";

const emptyForm = {
  category: "",
  subCategory: "",
  difficulty: "",
  questionText: "",
  link: "",
  shortAnswer: "",
  explanation: "",
  codeSnippet: "",
};

export default function AddQuestionDrawer({
  open,
  onClose,
  meta,
  presetFilters = {},
  editingQuestion,
  onQuestionUpdated,
}) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  /**
   * Prefill logic
   * - Edit → load full question
   * - Add  → apply preset filters
   */
  useEffect(() => {
    if (!open) return;

    // EDIT MODE → initialize once
    if (editingQuestion) {
      setForm(editingQuestion);
      return;
    }

    // ADD MODE → initialize with preset filters
    setForm({
      ...emptyForm,
      category: presetFilters.category || "",
      subCategory: presetFilters.subCategory || "",
      difficulty: presetFilters.difficulty || "",
    });
  }, [open, editingQuestion]);

  const submit = async () => {
    setStatus("submitting");

    try {
      let res;

      if (editingQuestion?.id) {
        // ✅ UPDATE
        res = await api.put(`/api/questions/${editingQuestion.id}`, form);
        onQuestionUpdated?.(res.data);
      } else {
        // ✅ CREATE
        await api.post("/api/questions", form);
      }

      setStatus("success");

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.85 },
      });

      setTimeout(() => {
        setForm(emptyForm);
        setStatus("idle");
        onClose();
      }, 1200);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const categories = meta.categories || [];
  const subCategories = form.category
    ? meta.subCategories[form.category] || []
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full 
  w-full sm:w-[520px] md:w-[600px] lg:w-[700px]
  bg-white shadow-2xl
  transform transition-transform duration-300 ease-out
  ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {editingQuestion ? "✏️ Edit Question" : "➕ Add Question"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Category */}
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory: "",
                })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Subcategory */}
            <select
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
              disabled={!form.category}
              className="w-full border rounded-md px-3 py-2 disabled:opacity-50"
            >
              <option value="">Sub Category</option>
              {subCategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Difficulty</option>
              {meta.difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Question */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Question
              </label>
              <textarea
                value={form.questionText}
                onChange={(e) =>
                  setForm({ ...form, questionText: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Reference Link (optional)
              </label>

              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://example.com"
                className="w-full border rounded-md px-3 py-2"
              />

              {/* 👇 ADD THIS HERE */}
              {form.link && (
                <a
                  href={form.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline mt-1 inline-block"
                >
                  Open Link ↗
                </a>
              )}
            </div>
            {/* Short Answer */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Short Answer
              </label>
              <textarea
                value={form.shortAnswer}
                onChange={(e) =>
                  setForm({ ...form, shortAnswer: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                rows={4}
              />
            </div>
            {/* Explanation */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Explanation (Markdown supported)
              </label>
              <textarea
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 font-mono"
                rows={10}
              />
            </div>

            {form.explanation && (
              <div className="border rounded-md p-3 bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Live Preview
                </p>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.explanation}
                </ReactMarkdown>
              </div>
            )}

            {/* Code */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Code Snippet
              </label>
              <textarea
                value={form.codeSnippet}
                onChange={(e) =>
                  setForm({ ...form, codeSnippet: e.target.value })
                }
                className="w-full rounded-md px-3 py-2 font-mono bg-gray-900 text-green-300"
                rows={10}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={submit}
              disabled={status === "submitting"}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all
                ${status === "idle" && "bg-indigo-600 hover:bg-indigo-700"}
                ${status === "submitting" && "bg-indigo-400"}
                ${status === "success" && "bg-green-500"}
                ${status === "error" && "bg-red-500"}
              `}
            >
              {status === "idle" &&
                (editingQuestion ? "Update Question" : "Add Question")}
              {status === "submitting" && "Saving…"}
              {status === "success" && "✓ Saved"}
              {status === "error" && "Failed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
