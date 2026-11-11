declare function renderSound(recipe: any, tune?: {}, options?: {}): Promise<any>;
declare function setSoundVolume(value: any): void;
declare function setSoundMuted(value: any): void;
declare function preloadSound(recipe: any, tune?: {}): void;
declare function playSound(recipe: any, tune?: {}): Promise<void>;
export { playSound, preloadSound, renderSound, setSoundMuted, setSoundVolume };
