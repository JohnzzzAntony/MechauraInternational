"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Phone, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/site-data";

export function MobileCTA() {
  const [visible, setVisible] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show after the hero, hide near the contact section
    setVisible(latest > 600 && latest < document.body.scrollHeight - 1200);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-40 lg:hidden"
        >
          <div className="glass flex items-center gap-2 rounded-2xl border border-border/60 p-2 shadow-2xl">
            <Button asChild variant="ghost" size="lg" className="flex-1">
              <a href={`tel:${company.phoneRaw}`}>
                <Phone className="size-4" />
                Call
              </a>
            </Button>
            <Button asChild variant="brand" size="lg" className="flex-1">
              <Link href="#contact">
                Get Quote
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
