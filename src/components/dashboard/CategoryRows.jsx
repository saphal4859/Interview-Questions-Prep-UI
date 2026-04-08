import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CategoryRow({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Main Row */}
      <div
        onClick={() => setOpen(!open)}
        className="grid grid-cols-12 px-6 py-4 border-t
                   cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="col-span-6 flex items-center gap-2 font-medium text-gray-900">
          {category.category.replaceAll("_", " ")}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>

        <div className="col-span-3 text-center text-gray-700">
          {category.subCategories.length}
        </div>

        <div className="col-span-3 text-center font-semibold text-gray-900">
          {category.totalQuestions}
        </div>
      </div>

      {/* Expand */}
      {open && (
        <div className="bg-gray-50 px-6 py-5 border-t">

          {/* Category Difficulty Summary */}
          <div className="flex gap-3 mb-5">
            <Badge label="Easy" value={category.easy} color="green" />
            <Badge label="Medium" value={category.medium} color="yellow" />
            <Badge label="Hard" value={category.hard} color="red" />
          </div>

          {/* 🔥 TABLE */}
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">

            {/* Header */}
            <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 uppercase bg-gray-100">
              <div className="col-span-5">Sub Topic</div>
              <div className="col-span-2 text-center">Easy</div>
              <div className="col-span-2 text-center">Medium</div>
              <div className="col-span-2 text-center">Hard</div>
              <div className="col-span-1 text-center">Total</div>
            </div>

            {/* Rows */}
            <div className="max-h-72 overflow-y-auto">
              {category.subCategories.map((s) => (
                <div
                  key={s.name}
                  className="grid grid-cols-12 px-4 py-3 border-t 
                             hover:bg-gray-50 transition"
                >
                  <div className="col-span-5 text-gray-800 font-medium">
                    {s.name.replaceAll("_", " ")}
                  </div>

                  <div className="col-span-2 text-center text-green-600 font-medium">
                    {s.easy}
                  </div>

                  <div className="col-span-2 text-center text-yellow-600 font-medium">
                    {s.medium}
                  </div>

                  <div className="col-span-2 text-center text-red-600 font-medium">
                    {s.hard}
                  </div>

                  <div className="col-span-1 text-center font-semibold text-gray-900">
                    {s.questionCount}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* Badge */
function Badge({ label, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {label}: {value}
    </span>
  );
}