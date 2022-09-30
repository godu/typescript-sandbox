export default {
  files: ["test/**/*", "!test/**/helpers/**/*"],
  extensions: {
    ts: "module",
  },
  nodeArguments: [
    "--no-warnings",
    "--loader=ts-node/esm/transpile-only",
    "--loader=esmock",
    "--experimental-specifier-resolution=node",
  ],
};
