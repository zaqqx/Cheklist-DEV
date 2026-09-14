export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
        </div>
      </header>

      <div className="h-9 w-full animate-pulse rounded-md bg-gray-200" />

      <ul className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="h-16 w-full animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
        ))}
      </ul>
    </div>
  );
}
