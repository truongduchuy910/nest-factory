const path = require("path");
const fs = require("fs");
const { upperCase } = require("lodash");

let [_node, _path, moduleName, moduleAt, moduleFile] = process.argv;

function kebabToCapitalized(str) {
  const words = str.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join("");
}

try {
  /**
   * validate args
   */
  if (!moduleName || !moduleAt) throw new Error("Missing arguments");

  /**
   * validate direction to put module at
   */
  const exists = fs.existsSync(moduleAt);
  if (!exists) throw new Error(`Direction not found ${moduleAt}`);

  /**
   * get example path to read template
   */
  const examplePath = path.join(__dirname, "example");
  const examples = fs.readdirSync(examplePath);

  /**
   * moduleFile default is moduleName
   */
  if (!moduleFile) moduleFile = moduleName;

  examples.forEach((fileExample) => {
    const fileModule = fileExample.replace("example", moduleFile);
    const examplePath = path.join(__dirname, "example", fileExample);
    const exampleContent = fs.readFileSync(examplePath, { encoding: "utf-8" });
    const moduleContent = exampleContent
      .replace(/example/g, moduleFile)
      .replace(/Example/g, kebabToCapitalized(moduleName))
      .replace(/EXAMPLE/g, upperCase(moduleName).replace(/ /g, "_"));

    const moduleDir = path.join(__dirname, "../../", moduleAt, moduleFile);
    const modulePath = path.join(moduleDir, fileModule);
    console.log("CREATE", fileModule);
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(modulePath, moduleContent, { encoding: "utf-8" });
  });
} catch (e) {
  console.error(e.message);
}
