import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/svg/empty-state.json";
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Lottie animation (local) */}
      <Lottie
        animationData={emptyStateAnimation}
        loop
        autoplay
        style={{ width: 720, height: 420 }}
      />

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
