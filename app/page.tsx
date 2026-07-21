import { currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        {user ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Congratulations!
            </h1>
            <p className="whitespace-nowrap text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              You&apos;ve successfully signed in through Agent&nbsp;ID.
            </p>
            {email && (
              <p className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Signed in as {email}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
              <svg
                className="h-8 w-8 text-zinc-500 dark:text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              You&apos;re not signed in
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Please sign in first to continue.
            </p>
            <SignInButton>
              <button className="mt-2 flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
                Sign in
              </button>
            </SignInButton>
          </>
        )}
      </main>
    </div>
  );
}
