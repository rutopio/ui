/** Render behind the consuming app's development-mode guard. */
export function ScreenSize() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex size-8 items-center justify-center rounded-full bg-gray-800 font-mono text-xs text-white">
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:block md:hidden">sm</span>
      <span className="hidden md:block lg:hidden">md</span>
      <span className="hidden lg:block xl:hidden">lg</span>
      <span className="hidden xl:block 2xl:hidden">xl</span>
      <span className="hidden 2xl:block">2xl</span>
    </div>
  );
}
