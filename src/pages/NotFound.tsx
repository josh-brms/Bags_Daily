import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-cy py-24 text-center">
      <h1 className="text-[1.7rem] font-semibold">Page not found</h1>
      <p className="mb-8 mt-3 text-muted">The page you're looking for isn't in the collection.</p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-md border border-ink bg-ink px-6 py-3 text-[0.9rem] font-medium text-cream no-underline transition-colors hover:border-[#3d3632] hover:bg-[#3d3632]"
      >
        Back to home
      </Link>
    </div>
  )
}
