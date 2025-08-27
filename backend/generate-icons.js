const sharp = require("sharp");
const fs = require("fs");

const input = "../frontend/public/favicon.png"; // your main logo (512x512 or larger)
const outputDir = "../frontend/public";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  await sharp(input)
    .resize(192, 192)
    .flatten({ background: "#0b1222" }) // Dark background
    .toFile(`${outputDir}/icon-192x192.png`);

  await sharp(input)
    .resize(512, 512)
    .flatten({ background: "#0b1222" })
    .toFile(`${outputDir}/icon-512x512.png`);

  await sharp(input)
    .resize(512, 512)
    .flatten({ background: "#0b1222" })
    .toFile(`${outputDir}/icon-512x512-maskable.png`);
})();
