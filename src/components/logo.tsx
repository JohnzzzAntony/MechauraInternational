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
 * Mechaura International — uses the real company logo from /logo.webp
 */
export function LogoMark({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo.webp"
      alt="Mechaura International Logo"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      priority
    />
  );
}

export function Logo({ withText = false, invert = false, className, size = 48 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} className="shrink-0" />
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
