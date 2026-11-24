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

## Options

Pass options to `pluginSolid()` in your Rsbuild config. The following options apply to version 2.

### `compiler`

Selects the JSX compiler. The default is `'native'`. To compile JSX with `@solidjs/babel-plugin`, use `pluginSolid({ compiler: 'babel' })`.

### `extensions`

The plugin compiles `.jsx`, `.tsx`, `.mjsx`, `.cjsx`, `.mtsx`, and `.ctsx` by default. To compile other extensions as JSX and enable Solid Refresh for them, pass an array of extensions with their leading dots.

```ts
pluginSolid({ extensions: ['.solid'] });
```

Import these files with the extension, for example `import App from './App.solid'`. To allow extensionless imports, also add `.solid` to Rsbuild's `resolve.extensions`.

### `dev`

Controls Solid's development runtime and development-only compiler transforms. It defaults to `true` in development mode and `false` in production mode.

The plugin prepends `solid` to Rsbuild's `resolve.conditionNames` so packages can provide Solid-specific exports. When `dev` is enabled, it also adds `development` after `solid`. Both take precedence over the configured conditions, which retain their relative order.

### `refresh`

Solid Refresh runs for web targets when HMR is enabled during development.

- Set `refresh.disabled` to `true` to turn off Solid Refresh while keeping Rsbuild HMR active. Defaults to `false`.
- `refresh.granular` defaults to `true`. It emits per-component metadata so that only components whose code changed are remounted on an edit.

### `ssr`

Set `ssr: true` to compile JSX for server rendering on Node.js targets and for DOM hydration on web targets. It defaults to `false`. See the [SSR fixture](./test/e2e/ssr) for the server entry, client entry, and Rsbuild configuration.

### `solid`

Pass a `SolidPresetOptions` object to override the options sent to the JSX compiler, including `generate`, `hydratable`, and `dev`. For example, `solid.dev` affects compiler transforms independently of which runtime the top-level `dev` option selects.

## License

[MIT](./LICENSE).
