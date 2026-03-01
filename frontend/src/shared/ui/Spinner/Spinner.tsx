export function Spinner() {
  return (
    <div role="status" aria-label="Loading" className="flex justify-center py-12">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
