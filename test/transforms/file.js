const path = require('path');

function process(src, filename) {
  const name = path.basename(filename);
  return `module.exports = ${JSON.stringify(name)};`;
}

module.exports = { process };
