const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const projectDir = path.resolve(__dirname, "..");
const resolve = (projectPath) => path.resolve(projectDir, projectPath);
const files = {
  manifest: resolve("src/manifest.json"),
  pkg: resolve("package.json"),
};
const paths = {
  src: ["./src/background.js", "./src/startHighlighter.js"].map(resolve),
  dist: resolve("./dist"),
  zip: resolve("./zip"),
};
const pkg = require(files.pkg);
const manifest = require(files.manifest);
const now = new Date();
const date = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

//////////////////////////////////////////////////////////////////////////

setProjectDir();
cleanupDist();
injectVersion();
buildExtension();
ensureZipFolder();
zipExtension();
cleanupDist();

//////////////////////////////////////////////////////////////////////////

function setProjectDir() {
  shell.cd(projectDir);
}

function cleanupDist() {
  shell.exec("rm -rf ./dist");
}

function buildExtension() {
  shell.exec("yarn build");
}

function injectVersion() {
  manifest.version = pkg.version;
  fs.writeFileSync(files.manifest, JSON.stringify(manifest, null, 2));
}

function ensureZipFolder() {
  shell.mkdir("-p", paths.zip);
}

function zipExtension() {
  shell.cd(paths.dist)
  shell.exec(`zip -r ../zip/wutch-${date}-${manifest.version}.zip *`);
}
