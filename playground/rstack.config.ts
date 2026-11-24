// Configuration guide: https://rstack.rs/config
import { define } from 'rstack';
import { pluginSolid } from '../src/index.ts';

define.app({
  plugins: [pluginSolid()],
});
