module.exports = [
  require("postcss-import"),
  require("stylelint")({
    plugins: [require("stylelint-scss")],
    rules: {
      "at-rule-no-unknown": null,
      "no-descending-specificity": true,
      "color-no-invalid-hex": null
    },
  }),
  require("postcss-reporter")({ clearReportedMessages: true }),
  require("@csstools/postcss-sass"),
  require("tailwindcss/nesting/index.js"),
  require("autoprefixer"),
];
