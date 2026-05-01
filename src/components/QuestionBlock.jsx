import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../api/api";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";
export default function QuestionBlock({
  q,
  index,
  expandAll,
  onEdit,
  onDelete,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Delete this question?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                setIsDeleting(true);

                await api.delete(`/api/questions/${q.id}`);

                setTimeout(() => {
                  onDelete?.(q.id);
                  toast.success("Question deleted");
                }, 300);
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete");
                setIsDeleting(false);
              }
            }}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          >
            Yes
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1 text-xs bg-gray-200 rounded"
          >
            No
          </button>
        </div>
      ),
      {
        duration: 4000,
      },
    );
  };
  useEffect(() => {
    setShowExplanation(expandAll);
  }, [expandAll]);

  return (
    <div
      className={`border-b py-4 transition-all duration-300 ${
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* 🔹 Question + Explain button */}
      <div className="flex items-start justify-between gap-3">
        {/* Question */}
        <h2 className="text-sm sm:text-base font-medium text-gray-800 leading-snug flex-1 flex items-center gap-2">
          <span>
            {index + 1}. {q.questionText}
          </span>

          {q.link && (
            <a
              href={q.link.startsWith("http") ? q.link : `https://${q.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 text-sm transition flex items-center"
              title="Open problem"
            >
              <FiExternalLink />
            </a>
          )}
        </h2>

        {/* Buttons (RIGHT SIDE, TOGETHER) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowExplanation((v) => !v)}
            className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            {showExplanation ? "Hide" : "Explain"}
          </button>

          <button
            onClick={() => onEdit?.(q)}
            className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            ✏️ Edit
          </button>
          {/* 🗑 DELETE BUTTON */}
          <button
            onClick={handleDelete}
            className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-red-500 hover:text-white transition"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      {/* 🔹 Tags */}
      <div className="text-[11px] text-gray-400 mt-1">
        {q.category} • {q.subCategory} • {q.difficulty}
      </div>

      {/* 🔹 Short Answer */}
      <div className="mt-2 text-sm text-gray-700">{q.shortAnswer}</div>

      {/* 🔹 Explanation */}
      {showExplanation && (
        <div className="mt-3 text-sm space-y-3 animate-fade-in">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {q.explanation || "No explanation available"}
            </ReactMarkdown>
          </div>

          {q.codeSnippet && (
            <div className="rounded-md overflow-hidden border">
              <SyntaxHighlighter
                language="java"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: "12px",
                  fontSize: "12px",
                }}
              >
                {q.codeSnippet}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
