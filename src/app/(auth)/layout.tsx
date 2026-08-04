import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-surface px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light)_0%,_transparent_55%)] opacity-80"
      />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex flex-col items-center gap-2 text-center"
        >
          <Image
            src="/logo.png"
            alt="Hello Ana Make"
            width={72}
            height={72}
            className="rounded-2xl"
            priority
          />
          <span className="font-script text-3xl text-primary">Hello Ana Make</span>
        </Link>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
