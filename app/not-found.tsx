import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! Looks like this meme got lost in the internet.</p>
      <img src="https://i.imgflip.com/2/1bgw.jpg" alt="Confused Travolta" className="mb-8 rounded-lg shadow-lg" />
      <Link href="/" className="bg-orange-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
        Go Home
      </Link>
    </div>
  )
}

