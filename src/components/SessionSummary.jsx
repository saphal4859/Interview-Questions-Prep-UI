export default function SessionSummary({
  targetCount,
  achievedCount,
  totalTime,
  onRestart,
}) {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-semibold mb-4">
        🎉 Session Completed
      </h2>

      <div className="space-y-2 text-gray-700">
        <p>
          Total Questions: <b>{targetCount}</b>
        </p>
        <p>
          Achieved: <b>{achievedCount}</b>
        </p>
        <p>
          Time Spent:{" "}
          <b>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </b>
        </p>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 px-6 py-2 rounded-md
                   bg-indigo-600 text-white
                   hover:bg-indigo-700"
      >
        Start New Session
      </button>
    </div>
  );
}
