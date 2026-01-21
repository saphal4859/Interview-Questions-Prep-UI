export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Lottie animation */}
      <dotlottie-wc
        src="https://lottie.host/d9bfd8ba-371f-4b02-9014-1a937eace2e3/2Zx4ZQvqAp.lottie"
        autoplay
        loop
        style={{ width: "420px", height: "420px" }}
      ></dotlottie-wc>

      {/* Text */}
      <h3 className="text-xl font-semibold text-gray-800 mt-4">
        Ready to practice?
      </h3>

      <p className="text-gray-500 mt-2 max-w-md">
        Select a category and difficulty, then click{" "}
        <span className="font-medium text-indigo-600">Start</span>{" "}
        to begin your interview prep.
      </p>
    </div>
  );
}
