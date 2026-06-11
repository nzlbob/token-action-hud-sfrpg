// Test stuff
/* console.log("TAH-SFRPG | Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
     console.log("TAH-SFRPG | This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.on("ready", function() {
    console.log("TAH-SFRPG | This code runs once core initialization is ready and game data is available.");
}); */

import { SystemManager } from './modules/system-manager.js'
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from './modules/constants.js'

Hooks.on('tokenActionHudCoreApiReady', async () => {
    const module = game.modules.get(MODULE.ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
})
