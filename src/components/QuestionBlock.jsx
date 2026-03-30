import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function QuestionBlock({ q, index }) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="border-b py-4">

      {/* 🔹 Question + Explain button */}
      <div className="flex justify-between items-start gap-3">
        <h2 className="text-sm sm:text-base font-medium text-gray-800 leading-snug">
          {index + 1}. {q.questionText}
        </h2>

        <button
          onClick={() => setShowExplanation((v) => !v)}
          className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 whitespace-nowrap"
        >
          {showExplanation ? "Hide" : "Explain"}
        </button>
      </div>

      {/* 🔹 Inline tags (compact) */}
      <div className="text-[11px] text-gray-400 mt-1">
        {q.category} • {q.subCategory} • {q.difficulty}
      </div>

      {/* 🔹 Short Answer */}
      <div className="mt-2 text-sm text-gray-700">
        {q.shortAnswer}
      </div>

      {/* 🔹 Explanation (Markdown + Code) */}
      {showExplanation && (
        <div className="mt-3 text-sm space-y-3 animate-fade-in">

          {/* Markdown explanation */}
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {q.explanation}
            </ReactMarkdown>
          </div>

          {/* Code */}
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