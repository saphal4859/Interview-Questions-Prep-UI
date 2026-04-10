import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function QuestionBlock({ q, index, expandAll, onEdit }) {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setShowExplanation(expandAll);
  }, [expandAll]);

  return (
    <div className="border-b py-4">
      {/* 🔹 Question + Explain button */}
      <div className="flex items-start justify-between gap-3">
        {/* Question */}
        <h2 className="text-sm sm:text-base font-medium text-gray-800 leading-snug flex-1">
          {index + 1}. {q.questionText}
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
