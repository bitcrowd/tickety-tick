const path = require("path"); // eslint-disable-line @typescript-eslint/no-var-requires

function process(src, filename) {
  const name = path.basename(filename);
  return `module.exports = ${JSON.stringify(name)};`;
}

module.exports = { process };
