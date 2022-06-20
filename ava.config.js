export default {
  files: ["test/**/*", "!test/**/helpers/**/*"],
  extensions: {
    ts: "module",
  },
  nodeArguments: [
    "--no-warnings",
    "--loader=ts-node/esm/transpile-only",
    "--experimental-specifier-resolution=node",
  ],
};
