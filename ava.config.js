export default {
  files: ["test/**/*", "!test/**/helpers/**/*"],
  extensions: {
    ts: "module",
  },
  nodeArguments: [
    "--no-warnings",
    "--loader=ts-node/esm",
    "--experimental-specifier-resolution=node",
  ],
};
