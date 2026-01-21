import { motion } from "framer-motion";

export default function SubCategoryDrawer({ category, onClose }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed top-0 right-0 w-full md:w-[420px] h-full
                 bg-slate-900 border-l border-slate-800 p-6 z-50"
    >
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white mb-6"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {category.category}
      </h2>

      <div className="space-y-3">
        {category.subCategories.map((sc) => (
          <div
            key={sc.name}
            className="flex justify-between bg-slate-800 rounded-lg p-3"
          >
            <span>{sc.name}</span>
            <span className="text-slate-400">
              {sc.questionCount}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
