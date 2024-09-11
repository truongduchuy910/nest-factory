const path = require("path");
const fs = require("fs");
const { upperCase } = require("lodash");

const [_node, _path, moduleName, moduleAt] = process.argv;

function kebabToCapitalized(str) {
  const words = str.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join("");
}

try {
  if (!moduleName || !moduleAt) throw new Error("Missing arguments");

  const exists = fs.existsSync(moduleAt);
  if (!exists) throw new Error(`Direction not found ${moduleAt}`);
  const examplePath = path.join(__dirname, "example");
  const examples = fs.readdirSync(examplePath);
  examples.forEach((fileExample) => {
    const fileModule = fileExample.replace("example", moduleName);
    const examplePath = path.join(__dirname, "example", fileExample);
    const exampleContent = fs.readFileSync(examplePath, { encoding: "utf-8" });
    const moduleContent = exampleContent
      .replace(/example/g, moduleName)
      .replace(/Example/g, kebabToCapitalized(moduleName))
      .replace(/EXAMPLE/g, upperCase(moduleName));

    const moduleDir = path.join(__dirname, "../../", moduleAt, moduleName);
    const modulePath = path.join(moduleDir, fileModule);
    console.log("CREATE", fileModule);
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(modulePath, moduleContent, { encoding: "utf-8" });
  });
} catch (e) {
  console.error(e.message);
}
