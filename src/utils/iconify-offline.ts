import { addCollection } from "@iconify/svelte/dist/functions.js";
import type { IconifyJSON } from "@iconify/types";
import devicon from "@iconify-json/devicon/icons.json";
import gameIcons from "@iconify-json/game-icons/icons.json";
import hugeicons from "@iconify-json/hugeicons/icons.json";
import iconoir from "@iconify-json/iconoir/icons.json";
import logos from "@iconify-json/logos/icons.json";
import materialIconTheme from "@iconify-json/material-icon-theme/icons.json";
import materialSymbols from "@iconify-json/material-symbols/icons.json";
import mdi from "@iconify-json/mdi/icons.json";
import mingcute from "@iconify-json/mingcute/icons.json";
import skillIcons from "@iconify-json/skill-icons/icons.json";
import vscodeIcons from "@iconify-json/vscode-icons/icons.json";

const collections: IconifyJSON[] = [
    materialSymbols,
    logos,
    devicon,
    hugeicons,
    mingcute,
    mdi,
    skillIcons,
    vscodeIcons,
    materialIconTheme,
    gameIcons,
    iconoir,
];

let svelteRegistered = false;
let webComponentRegistered = false;

function addCollectionsToWebComponent(): void {
    if (typeof window === "undefined" || webComponentRegistered) {
        return;
    }

    const IconifyIcon = customElements.get("iconify-icon") as
        | (CustomElementConstructor & {
              addCollection?: (data: IconifyJSON, provider?: string) => boolean;
              disableCache?: (storage: string) => void;
          })
        | undefined;

    if (!IconifyIcon?.addCollection) {
        return;
    }

    IconifyIcon.disableCache?.("all");

    for (const collection of collections) {
        IconifyIcon.addCollection(collection);
    }

    webComponentRegistered = true;
}

/** Register offline collections for @iconify/svelte (navbar, player, etc.). */
export function registerSvelteIconifyCollections(): void {
    if (svelteRegistered) {
        return;
    }
    svelteRegistered = true;

    for (const collection of collections) {
        addCollection(collection);
    }
}

/** Register offline collections for iconify-icon web component (icon.astro). */
export function registerWebComponentIconifyCollections(): void {
    addCollectionsToWebComponent();
}

/** Register all offline icon sets (Svelte + web component when available). */
export function registerIconifyCollections(): void {
    registerSvelteIconifyCollections();
    registerWebComponentIconifyCollections();
}
