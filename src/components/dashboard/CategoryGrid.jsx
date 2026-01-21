import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ categories }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-300">
        Categories Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.category} category={cat} />
        ))}
      </div>
    </div>
  );
}
