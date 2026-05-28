function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
