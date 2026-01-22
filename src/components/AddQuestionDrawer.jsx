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

    if (editingQuestion) {
      setForm(editingQuestion);
    } else {
      setForm({
        ...emptyForm,
        category: presetFilters.category || "",
        subCategory: presetFilters.subCategory || "",
        difficulty: presetFilters.difficulty || "",
      });
    }
  }, [open, presetFilters, editingQuestion]);

  const submit = async () => {
    setStatus("submitting");

    try {
      let res;

      if (editingQuestion?.id) {
        // ✅ UPDATE
        res = await api.put(
          `/api/questions/${editingQuestion.id}`,
          form
        );
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
        className={`absolute right-0 top-0 h-full w-[440px] bg-white shadow-2xl
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
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value })
              }
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
            <textarea
              placeholder="Question"
              value={form.questionText}
              onChange={(e) =>
                setForm({ ...form, questionText: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
              rows={3}
            />

            {/* Short Answer */}
            <textarea
              placeholder="Short Answer"
              value={form.shortAnswer}
              onChange={(e) =>
                setForm({ ...form, shortAnswer: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
              rows={2}
            />

            {/* Explanation */}
            <textarea
              placeholder="Explanation (Markdown supported)"
              value={form.explanation}
              onChange={(e) =>
                setForm({ ...form, explanation: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 font-mono"
              rows={5}
            />

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
            <textarea
              placeholder="Java Code Snippet"
              value={form.codeSnippet}
              onChange={(e) =>
                setForm({ ...form, codeSnippet: e.target.value })
              }
              className="w-full rounded-md px-3 py-2 font-mono bg-gray-900 text-green-300"
              rows={5}
            />
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
