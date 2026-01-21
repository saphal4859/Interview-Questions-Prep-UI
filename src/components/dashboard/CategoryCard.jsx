import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import SubCategoryDrawer from "./SubCategoryDrawer";
import { useState } from "react";

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

export default function CategoryCard({ category }) {
  const [open, setOpen] = useState(false);

  const difficultyData = Object.entries(category.difficultySplit).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{category.category}</h3>
          <span className="text-sm text-slate-400">
            {category.totalQuestions} Qs
          </span>
        </div>

        <div className="flex justify-center mt-4">
          <PieChart width={160} height={160}>
            <Pie
              data={difficultyData}
              dataKey="value"
              innerRadius={50}
              outerRadius={70}
            >
              {difficultyData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </motion.div>

      {open && (
        <SubCategoryDrawer
          category={category}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
