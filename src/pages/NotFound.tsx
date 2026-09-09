import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container-cy py-20">
      <div className="glass glass-ring glass-sheen mx-auto max-w-xl rounded-lg p-10 text-center">
        <h1 className="text-[1.7rem] font-semibold">Page not found</h1>
        <p className="mb-8 mt-3 text-ink/80">The page you're looking for isn't in the collection.</p>
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
