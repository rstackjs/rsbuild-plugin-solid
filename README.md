# @rsbuild/plugin-solid

Compile Solid JSX with Rsbuild, use Solid Refresh during development, and build client and server bundles for server-side rendering.

## Quick start

To create a new app, run `npm create rsbuild@latest` and select **Solid**. To add the plugin to an existing Rsbuild app that uses Solid 2, install it as a dev dependency.

```sh
npm install -D @rsbuild/plugin-solid
```

Register the plugin in `rsbuild.config.ts`.

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [pluginSolid()],
});
```

The plugin uses Solid's native JSX compiler by default. See the [playground](./playground) for a working TypeScript app.

### Solid 1

For Solid 1 projects, install the 1.x version of the plugin together with the Rsbuild Babel plugin. Then register both plugins in `rsbuild.config.ts`.

```sh
npm install -D @rsbuild/plugin-solid@1 @rsbuild/plugin-babel
```

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [pluginBabel({ include: /\.(?:jsx|tsx)$/ }), pluginSolid()],
});
```

## Resolution behavior

The Solid plugin adds `solid` to Rsbuild's [resolve.conditionNames](https://rsbuild.rs/config/resolve/condition-names). This allows package exports to resolve Solid-specific entries when they are available.

In development mode, the plugin also adds `development` to resolve Solid's development runtime and enables development-only compiler transforms. You can disable both behaviors with [`dev: false`](#dev).

If you configure `resolve.conditionNames`, the plugin preserves your configured values and prepends these Solid conditions.

## Options

To customize the compilation behavior of Solid, use the following options.

### compiler

The JSX compiler backend. The native compiler is used by default. Set this option to `'babel'` to compile JSX with `@solidjs/babel-plugin` instead.

- **Type:** `'native' | 'babel'`
- **Default:** `'native'`
- **Version:** `>= 2.0.0`
- **Example:**

```ts
pluginSolid({
  compiler: 'babel',
});
```

### extensions

The plugin supports `.jsx`, `.tsx`, `.mjsx`, `.cjsx`, `.mtsx`, and `.ctsx` files by default. If your project uses other file extensions, add them to `extensions`. Include the leading dot, as in `.solid`.

- **Type:** `string[]`
- **Default:** `[]`
- **Version:** `>= 2.0.0`
- **Example:**

```ts
pluginSolid({
  extensions: ['.solid'],
});
```

With this configuration, the plugin compiles `.solid` files as JavaScript with JSX and supports Solid Refresh for those files during development.

When importing files like `App.mtsx` or `App.solid`, include the extension, as in `import App from './App.solid'`. To omit an extension in imports, add it to Rsbuild's [resolve.extensions](https://rsbuild.rs/config/resolve/extensions).

### dev

Whether to enable Solid's development runtime and development-only compiler transforms. Set it to `false` to disable both behaviors in development mode, or set it to `true` to enable them in production mode.

If `solid.dev` is explicitly configured, it overrides the `dev` setting for compiler transforms without affecting runtime resolution.

- **Type:** `boolean`
- **Default:** `true` in development mode, `false` in production mode
- **Example:**

```ts
pluginSolid({
  dev: false,
});
```

### refresh.disabled

Whether to disable Solid Refresh for HMR in development mode. This only controls the refresh transform and does not disable Rsbuild HMR.

- **Type:** `boolean`
- **Default:** `false`
- **Example:**

```ts
pluginSolid({
  refresh: {
    disabled: true,
  },
});
```

### refresh.granular

Whether to emit per-component metadata so edits only remount components whose code changed.

- **Type:** `boolean`
- **Default:** `true`
- **Version:** `>= 2.0.0`
- **Example:**

```ts
pluginSolid({
  refresh: {
    granular: false,
  },
});
```

### ssr

Whether to generate output for Solid SSR. When enabled, the plugin uses `generate: 'ssr'` and `hydratable: true` for Node.js targets, and uses `generate: 'dom'` and `hydratable: true` for other targets.

Values in [`solid`](#solid) will override these defaults.

- **Type:** `boolean`
- **Default:** `false`
- **Example:**

```ts
pluginSolid({
  ssr: true,
});
```

### solid

Options passed to the Solid JSX compiler through [solid-loader](https://github.com/rstackjs/solid-loader#solid).

- **Type:** `SolidPresetOptions`
- **Default:** `{}`
- **Example:**

```ts
pluginSolid({
  solid: {
    generate: 'ssr',
    hydratable: true,
  },
});
```

## License

[MIT](./LICENSE).
