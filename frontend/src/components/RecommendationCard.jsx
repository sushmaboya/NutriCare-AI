function RecommendationCard({ title, description, items }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{description}</p>
      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.name || item._id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
              <h3 className="font-semibold">{item.name}</h3>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {item.category && <span>{item.category}</span>}
                {item.calories && <span> · {item.calories} kcal</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No suggestions available yet.</p>
        )}
      </div>
    </div>
  );
}

export default RecommendationCard;
