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
npm uninstall -g
```

## Use

### Command

- target `./{YOUR_PROJECT}`

  ```bash
  tailwind-g-wtach
  ```

- target `./{YOUR_PROJECT}/views`

  ```bash
  tailwind-g-wtach --dir views
  ```

- minified output css

  ```bash
  tailwind-g-wtach --minify
  ```

### Your Project File Tree Example

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

Do not define `plugins` in your project `tailwind.config.js`.

#### Supported View File Extensions

- `jsx`, `tsx`, `vue`, `blade.php`, `pug`, `html`
