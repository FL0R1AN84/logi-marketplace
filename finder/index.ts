import { PluginSDK } from '@logitech/plugin-sdk';
import { finderActions } from './src/actions.js';

const pluginSDK = new PluginSDK();

for (const action of finderActions) {
  pluginSDK.registerAction(action);
}

await pluginSDK.connect();
