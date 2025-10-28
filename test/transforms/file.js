const path = require("path"); // eslint-disable-line @typescript-eslint/no-require-imports

function process(_src, filename) {
  const name = path.basename(filename);
  const namestr = JSON.stringify(name);

  if (filename.match(/\.svg$/)) {
    return `
      const React = require("react");
      module.exports = {
        __esModule: true,
        default: ${namestr},
        ReactComponent: React.forwardRef(function Svg(props, ref) {
          return {
            $$typeof: Symbol.for("react.element"),
            type: "svg",
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${namestr}
            })
          };
        }),
      };
    `;
  }

  return `module.exports = ${namestr};`;
}

module.exports = { process };
