export const spring = {
    fast: {
        type: "spring",
        duration: 0.08,
        bounce: 0,
        exit: { duration: 0.06 },
    },
    // Critically damped: same perceived speed as a bouncier tier, but lands
    // exactly with no overshoot — for short travel and panels/sheets that must
    // settle precisely (dropdowns, tabs, drawers, merged selection backgrounds).
    moderate: {
        type: "spring",
        duration: 0.16,
        bounce: 0,
        exit: { duration: 0.12 },
    },
    slow: {
        type: "spring",
        duration: 0.24,
        bounce: 0.12,
        exit: { duration: 0.16 },
    },
};
