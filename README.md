# tailwind-g-watch

## Introduce

This is an unofficial command, developed for personal projects.

This command will 'watch' and 'build' several tailwind based css files within the project.

Support [TailwindCSS](https://tailwindcss.com/) 3.2+

### Support Lang and Ext

- Target Files
  `.jsx`, `.tsx`, `.vue`, `.blade.php`, `.pug`, `.html`

- css(style) Files
  `assets/css/config.css`, `assets/scss/config.scss`

## Installation

Install this source outside your project.

```bash
git clone https://github.com/HighK/tailwind-g-watch
cd tailwind-g-watch
npm i
npm i -g
```

### Update Command

```bash
cd tailwind-g-watch
git pull origin master
npm i
npm i -g
```

### Uninstall Command

```bash
cd tailwind-g-watch
npm uninstall -g
```

## Use

```bash
cd ${YOUR_PROJECT_ROOT}
```

### Command

```bash
tailwind-g-watch
```

```plain
Usage: tailwind-g-watch -d <dir path> -m

Options:
  -m, --minify   Minify output css
  -d, --dir      Watch directory path                                   [string]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  tailwind-g-watch           watch .
  tailwind-g-watch -d views  watch ./views
```

### File Tree Example

```plain
.
├── assets/
│   └── css/
│       ├── config.css <-- tailwind config css
│       └── index.dist.css <-- output css (this command create)
├── index.html <-- view file
├── views/
│   ├── apple/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       ├── config.css
│   │   │       └── index.dist.css
│   │   └── apple.html
│   └── banana/
│       ├── assets/
│       │   └── scss/
│       │   │   ├── config.scss
│       │   │   └── _sub.scss
│       │   └── css/
│       │       └── index.dist.css
│       └── banana.html
└── tailwind.config.js <-- project tailwind.config.js
```

#### File Examples

- `./tailwind.config.js`
  TailwindCSS Configuration Guide: [https://tailwindcss.com/docs/configuration]

  ```javascript
  module.exports = {
    theme: {
      screens: {
        sm: "360px",
        md: "968px",
        lg: "1024px",
        xl: "1440px",
      },
    },
    corePlgins: {
      preflight: false,
    },
  };
  ```

  - `plugins` is defined in [Defualt TailwindCSS Plugins](#defualt-tailwindcss-plugins) and run the merge configuration.

  - If you define `plugins` your `tailwind.config.js`, See [Use TailwindCSS custom config and other node modules](#use-tailwindcss-custom-config-and-other-node-modules)

- `./assets/css/config.css`

  ```css
  /* @tailwind base; */
  /* @tailwind components; */

  /* Read your `view file` and generate TailwindCSS */
  @tailwind utilities;

  /* Add your custom css */
  ```

#### Defualt TailwindCSS Plugins

```javascript
module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
```

### Local TailwindCSS Config file

#### Config File Tree Example

```plain
.
├── assets/
│   └── css/
│       ├── config.css
│       └── index.dist.css
├── index.html
├── views/
│   ├── apple/
│   │   ├── assets/
│   │   │   └── config/
│   │   │       ├── config.js <-- "views/apple/" tailwind config
│   │   │   └── css/
│   │   │       ├── config.css
│   │   │       └── index.dist.css
│   │   └── apple.html
└── tailwind.config.js <-- project tailwind.config.js
```

#### Config File Examples

- `./views/apple/assets/config/config.js`

  ```javascript
  module.exports = {
    content: ["views/apple/*.html"]
    plugins: [
      require("@tailwindcss/typography"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/line-clamp"),
      require("@tailwindcss/aspect-ratio"),
      require("@tailwindcss/container-queries"),
    ],
  };
  ```

  - In this case [Defualt TailwindCSS Plugins](#defualt-tailwindcss-plugins) not working.
  - Thus you need define `plugins` in your `config.js`. See [Use TailwindCSS custom config and other node modules](#use-tailwindcss-custom-config-and-other-node-modules)

- `./views/apple/assets/css/config.css`

  ```css
  @config "../config/config.js";
  @tailwind utilities;

  /* Add your custom css */
  ```

### Use TailwindCSS custom config and other node modules

E.g, If you define `plugins` in your project `tailwind.config.js` or `config.js`

```bash
cd ${YOUR_PROJECT_ROOT}
```

```bash
npm init -y
npm i -D tailwindcss
```

```bach
npm i -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/line-clamp @tailwindcss/aspect-ratio [and others...]
```

## Sass Build

Since this is not node-sass, it will not find and build all `.scss` files in your project, this command will start building with `**/assets/scss/config.scss`.

The `@import` syntax does not work according to the sass rules and should be used as in the example below.

`views/banana/assets/scss/config.scss`

- Not working

  ```scss
  @import "sub";
  @import "_scss";
  ```

- Working

  ```scss
  @import "./_sub.scss";
  ```
