import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CategoryRow({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Row */}
      <div
        onClick={() => setOpen(!open)}
        className="grid grid-cols-12 px-6 py-4 border-t
                   cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="col-span-6 flex items-center gap-2 font-medium text-gray-900">
          {category.category.replaceAll("_", " ")}
          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </div>

        <div className="col-span-3 text-center text-gray-700">
          {category.subCategories.length}
        </div>

        <div className="col-span-3 text-center font-medium text-gray-900">
          {category.totalQuestions}
        </div>
      </div>

      {/* Expand */}
      {open && (
        <div className="bg-gray-50 px-10 py-4 text-sm">
          {/* Difficulty */}
          <div className="flex gap-4 mb-3">
            {Object.entries(category.difficultySplit).map(([d, c]) => (
              <Badge key={d} label={`${d}: ${c}`} />
            ))}
          </div>

          {/* Sub categories */}
          <div className="flex flex-wrap gap-2">
            {category.subCategories.map((s) => (
              <span
                key={s.name}
                className="px-3 py-1 bg-white border rounded-full text-xs"
              >
                {s.name} ({s.questionCount})
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Badge({ label }) {
  return (
    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
      {label}
    </span>
  );
}
