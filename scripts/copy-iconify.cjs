const { copyFileSync, mkdirSync } = require("fs");
const { dirname, join } = require("path");

const src = join(__dirname, "../node_modules/iconify-icon/dist/iconify-icon.min.js");
const dest = join(__dirname, "../public/assets/iconify/iconify-icon.min.js");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`Copied iconify-icon.min.js to ${dest}`);
