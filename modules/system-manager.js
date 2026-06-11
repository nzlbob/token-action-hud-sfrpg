// System Module Imports
import { ActionHandler } from './action-handler.js'
import { RollHandler as Core } from './roll-handler.js'
import { DEFAULTS } from './defaults.js'
import * as systemSettings from './settings.js'

export let SystemManager = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    SystemManager = class SystemManager extends coreModule.api.SystemManager {
        /** @override */
        getActionHandler () {
            const actionHandler = new ActionHandler()
            return actionHandler
        }

        /** @override */
        getAvailableRollHandlers () {
            const coreTitle = 'Core SFRPG'

            const choices = { core: coreTitle }

            return choices
        }

        /** @override */
        getRollHandler (handlerId) {
            let rollHandler
            switch (handlerId) {
            case 'core':
            default:
                rollHandler = new Core()
                break
            }

            return rollHandler
        }

        /** @override */
        registerSettings (onChangeFunction) {
            systemSettings.register(onChangeFunction)
        }

        /** @override */
        async registerDefaults () {
            return DEFAULTS
        }
    }
})
