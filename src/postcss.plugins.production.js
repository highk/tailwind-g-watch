module.exports = [
  require("postcss-discard-comments")({
    removeAll: true,
  }),
  require("cssnano")({
    preset: "cssnano-preset-default",
  }),
  require("postcss-preset-env")({
    browsers: ["ie 10", "> 2%", "last 2 versions"],
    features: { "nesting-rules": false },
  }),
];
