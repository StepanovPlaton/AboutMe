import { readFileSync } from "fs";
import { join } from "path";

const inventoryPath = join(import.meta.dirname, "../src/generated/icon-inventory.json");

export function loadIconInventory() {
    return JSON.parse(readFileSync(inventoryPath, "utf8"));
}

export function toAstroIconInclude(inventory) {
    /** @type {Record<string, string[]>} */
    const include = {};
    for (const [prefix, icons] of Object.entries(inventory)) {
        include[prefix] = icons;
    }
    return include;
}
