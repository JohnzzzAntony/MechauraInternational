import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  withText?: boolean;
  invert?: boolean;
  className?: string;
  size?: number;
}

/**
 * Mechaura International — Icon Mark only (orange mountain gear mark)
 */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Mechaura International Mark"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain h-auto w-auto", className)}
      priority
    />
  );
}

/**
 * Mechaura International — Full Logo with transparent background
 * Automatically adapts text color for Dark mode (white text) and Light mode (navy text)
 */
export function Logo({ withText = false, invert = false, className, size = 40 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Full Logo — Dark Mode (white text + orange mark + transparent bg) */}
      <Image
        src="/logo-dark.png"
        alt="Mechaura International Logo"
        width={180}
        height={size}
        className={cn(
          "shrink-0 object-contain h-9 w-auto",
          invert ? "block" : "hidden dark:block",
          className
        )}
        priority
      />
      {/* Full Logo — Light Mode (navy text + orange mark + transparent bg) */}
      <Image
        src="/logo-light.png"
        alt="Mechaura International Logo"
        width={180}
        height={size}
        className={cn(
          "shrink-0 object-contain h-9 w-auto",
          invert ? "hidden" : "block dark:hidden",
          className
        )}
        priority
      />

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

