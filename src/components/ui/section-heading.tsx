import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full flex-wrap items-end justify-between gap-4",
          align === "center" && "justify-center",
        )}
      >
        <div className={cn(align === "center" && "flex flex-col items-center")}>
          {eyebrow ? (
            <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-xl text-sm text-text-secondary md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}
