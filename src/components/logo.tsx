import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  withText?: boolean;
  invert?: boolean;
}

/**
 * Mechaura International — premium industrial logo mark
 * A hexagonal gear-inspired mark with an "M" formation in the center,
 * rendered in brand amber. Combines precision engineering cues with
 * the company initial.
 */
export function LogoMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("size-8", className)}
      {...props}
    >
      {/* Outer hexagon ring */}
      <path
        d="M24 2L42.5 12.5V35.5L24 46L5.5 35.5V12.5L24 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brand"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Inner M formation */}
      <path
        d="M14 33V17L24 26L34 17V33"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand"
      />
      {/* Bottom accent line */}
      <path
        d="M14 36H34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-brand"
        opacity="0.4"
      />
    </svg>
  );
}

export function Logo({ withText = true, invert = false, className, ...props }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} {...(props as any)}>
      <LogoMark className="size-8 shrink-0" />
      {withText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-base font-bold tracking-tight",
              invert ? "text-white" : "text-foreground",
            )}
          >
            MECHAURA
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.18em]",
              invert ? "text-white/60" : "text-muted-foreground",
            )}
          >
            International
          </span>
        </span>
      )}
    </span>
  );
}
