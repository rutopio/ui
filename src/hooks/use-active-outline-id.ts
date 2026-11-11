import { useMemo } from "react";
import type { OutlineItem } from "../types/outline.js";

export function useActiveOutlineId(
  items: OutlineItem[],
  sectionProgress: Record<string, number>,
): string {
  return useMemo(() => {
    let active = items[0]?.id ?? "";
    for (const item of items) {
      if ((sectionProgress[item.id] ?? 0) > 0) active = item.id;
    }
    return active;
  }, [items, sectionProgress]);
}

