import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function QuestionCard({
  question,
  currentIndex,
  totalCount,
  showAnswer,
  autoShowAnswer,
  onShowAnswer,
  achievedCount,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCode, setShowCode] = useState(false);
  useEffect(() => {
    if (autoShowAnswer && !showAnswer) {
      onShowAnswer();
    }
  }, [question, autoShowAnswer]);
  if (!question && totalCount === 0) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Select filters and click <b>Start</b> to begin
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      {/* Progress */}
      {totalCount > 0 && (
        <>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{
                width: `${(achievedCount / totalCount) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mb-4">
            {achievedCount} of {totalCount} completed
          </div>
        </>
      )}

      {/* Header */}
      {totalCount > 0 && (
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>
            Question{" "}
            <b className="text-gray-800">
              {currentIndex + 1} / {totalCount}
            </b>
            {question?.id && (
              <span className="ml-2 text-gray-400">• ID: {question.id}</span>
            )}
          </span>

          <span>
            Achieved: <b className="text-gray-800">{achievedCount}</b>
          </span>
        </div>
      )}

      {/* Question */}
      <div
        className="font-semibold leading-snug transition-colors
    text-2xl md:text-3xl text-red-600"
      >
        {question.questionText}
      </div>

      {/* Show Answer */}
      {!showAnswer && (
        <div className="mt-6">
          <button
            onClick={onShowAnswer}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Show Answer
          </button>
        </div>
      )}

      {/* Answer */}
      {showAnswer && (
        <div className="mt-6 space-y-4">
          {/* Short Answer */}
          {question.shortAnswer && (
            <div>
              <p className="font-medium mb-1">Answer</p>
              <p className="text-gray-800">{question.shortAnswer}</p>
            </div>
          )}

          {/* Toggles */}
          <div className="flex gap-3 pt-2">
            {question.explanation && (
              <button
                onClick={() => setShowExplanation((v) => !v)}
                className={`px-4 py-1.5 rounded-full text-sm border transition
                  ${
                    showExplanation
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "hover:bg-gray-100"
                  }`}
              >
                📘 Explanation
              </button>
            )}

            {question.codeSnippet && (
              <button
                onClick={() => setShowCode((v) => !v)}
                className={`px-4 py-1.5 rounded-full text-sm border transition
                  ${
                    showCode
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "hover:bg-gray-100"
                  }`}
              >
                💻 Code
              </button>
            )}
          </div>

          {/* Explanation + Code */}
          {(showExplanation || showCode) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-fade-in">
              {/* Explanation */}
              {showExplanation && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium mb-2">Explanation</p>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {question.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Code */}
              {showCode && (
                <div className="rounded-lg overflow-hidden border">
                  <SyntaxHighlighter
                    language="java"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      fontSize: "14px",
                      height: "100%",
                    }}
                  >
                    {question.codeSnippet}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
