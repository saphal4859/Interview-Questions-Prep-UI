export default function NavigationControls({
  onPrev,
  onNext,
  disablePrev,
}) {
  return (
    <div className="mt-6 pt-4 border-t flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={disablePrev}
        className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-40"
      >
        ◀ Previous
      </button>

      <button
        onClick={onNext}
        className="px-4 py-2 rounded border hover:bg-gray-100"
      >
        Next ▶
      </button>
    </div>
  );
}
