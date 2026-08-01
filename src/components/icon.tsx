"use client";

import * as React from "react";
import {
  ShieldCheck,
  Network,
  Truck,
  Headset,
  Wrench,
  Brush,
  Settings,
  CircleDot,
  GitBranch,
  Scissors,
  MoveVertical,
  Zap,
  Factory,
  Car,
  HardHat,
  Flame,
  Ruler,
  Building2,
  TrendingDown,
  BadgeCheck,
  type LucideProps,
} from "lucide-react";

const iconMap = {
  "shield-check": ShieldCheck,
  network: Network,
  truck: Truck,
  headset: Headset,
  wrench: Wrench,
  brush: Brush,
  settings: Settings,
  "circle-dot": CircleDot,
  "git-branch": GitBranch,
  scissors: Scissors,
  "move-vertical": MoveVertical,
  zap: Zap,
  factory: Factory,
  car: Car,
  "hard-hat": HardHat,
  flame: Flame,
  ruler: Ruler,
  "building-2": Building2,
  "trending-down": TrendingDown,
  "badge-check": BadgeCheck,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const Cmp = iconMap[name] ?? Settings;
  return <Cmp {...props} />;
}
