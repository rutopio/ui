export function scrollToSection(id, onBeforeNavigate) {
    onBeforeNavigate?.();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
        const heading = document.getElementById(id);
        if (!heading)
            return;
        heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        history.replaceState(null, "", `#${encodeURIComponent(id)}`);
    }, reduceMotion ? 0 : 350);
}
export async function copySectionLink(id, onCopied, onError) {
    const url = new URL(window.location.href);
    url.hash = id;
    try {
        await navigator.clipboard.writeText(url.href);
        onCopied?.();
    }
    catch {
        onError?.();
    }
}
