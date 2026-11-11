import { useMemo } from "react";
export function useActiveOutlineId(items, sectionProgress) {
    return useMemo(() => {
        let active = items[0]?.id ?? "";
        for (const item of items) {
            if ((sectionProgress[item.id] ?? 0) > 0)
                active = item.id;
        }
        return active;
    }, [items, sectionProgress]);
}
