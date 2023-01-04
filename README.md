# tailwind-g-watch

## Introduce

This command will 'watch' and 'build' multiple `TailwindCSS' within your project individually.

## Installation

Install this source outside your project.

```bash
git clone https://github.com/HighK/tailwind-g-watch
cd tailwind-g-watch
npm i
npm i -g
```

### Uninstall command

```bash
cd tailwind-g-watch
npm uninstall -g
```

## Use

### Command

- target `.`

  ```bash
  tailwind-g-wtach
  ```

- target `./views`

  ```bash
  tailwind-g-wtach --dir views
  ```

- minified output css

  ```bash
  tailwind-g-wtach --minify
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
│       │   └── css/
│       │       ├── config.css
│       │       └── index.dist.css
│       └── banana.html
└── tailwind.config.js <-- project tailwind.config.js
```

#### File Examples

- `./tailwind.config.js`

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

- `./assets/css/config.css`

  ```css
  @tailwind utilities;

  .your-custom-css {
  }
  ```

#### Defualt TailwindCSS Plugins

```javascript
module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
```

#### Supported View File Extensions

- `jsx`, `tsx`, `vue`, `blade.php`, `pug`, `html`

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
│   │   │       ├── config.js <-- "apple/" tailwind config
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
    ],
  };
  ```

- `./views/apple/assets/css/config.css`

  ```css
  @config "../config/config.js";
  @tailwind utilities;
  ```

### Use TailwindCSS custom config and other node modules

Example, If you define `plugins` in your project `tailwind.config.js` or `config.js`

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
