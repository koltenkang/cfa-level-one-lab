const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");
const serverDir = path.join(distDir, "server");
const metaDir = path.join(distDir, ".openai");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.renameSync(outDir, assetsDir);
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(metaDir, { recursive: true });

fs.writeFileSync(
  path.join(serverDir, "index.js"),
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`,
  "utf8"
);

fs.copyFileSync(
  path.join(root, ".openai", "hosting.json"),
  path.join(metaDir, "hosting.json")
);
