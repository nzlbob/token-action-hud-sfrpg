export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {

        /**
        * Handle Action Event
        * @override
        * @param {object} event
        * @param {string} encodedValue
        */
        async doHandleActionEvent (event, encodedValue) {
            const payload = encodedValue.split('|')

            if (payload.length !== 2) {
                super.throwInvalidValueErr()
            }

            const actionType = payload[0]
            const actionId = payload[1]

            const renderable = ['equipment', 'feat', 'action', 'lore', 'ammo']
            if (renderable.includes(actionType) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = [
                "character",
                "drone",
                "hazard",
                "npc2",
                "starship",
                "vehicle",
                "npc"
            ]
            
            if (!this.actor) {
                const controlledTokens = canvas.tokens.controlled.filter((token) =>
                    knownCharacters.includes(token.actor?.type)
                )
                for (const token of controlledTokens) {
                    const actor = token.actor
                    await this._handleMacros(event, actionType, actor, token, actionId)
                }
            } else {
                await this._handleMacros(event, actionType, this.actor, this.token, actionId)
            }
        }

        /**
         * Handle Macros
         * @private
         * @param {object} event
         * @param {string} actionType
         * @param {object} actor
         * @param {object} token
         * @param {string} actionId
         */
        async _handleMacros (event, actionType, actor, token, actionId) {

            switch (actionType) {
            case 'ability':
                this._rollAbility(event, actor, actionId)
                break
            case 'action':
            case 'feat':
            case 'equipment':
                this._rollEquipment(event, actor, actionId)
                break
            case 'save':
                this._rollSave(event, actor, actionId)
                break
            case 'spell':
                await this._rollSpell(event, actor, actionId)
                break
            case 'skill':
                await this._rollSkill(event, actor, actionId)
                break
            case 'utility':
                this._performUtilityMacro(token, actionId)
                break
            }
        }
        
        /**
        * Roll Equipment
        * @private
        * @param {object} event    The event
        * @param {object} actor    The actor
        * @param {string} actionId The action id
        */
        _rollEquipment (event, actor, actionId) {
            const equipment = actor.items.get(actionId)
            console.log(event, actor, actionId)
            if (event.ctrlKey) {
                equipment.rollAttack();
            } else if (event.altKey) {
                equipment.rollDamage();
            } else {
                equipment.roll();
            }
        }

        /**
        * Roll Skill
        * @private
        * @param {object} event    The event
        * @param {object} actor    The actor
        * @param {string} actionId The action id
        */
        _rollSkill (event, actor, actionId) {
            actor.rollSkill(actionId, { event: event });
        }

        /**
         * Roll Ability
         * @private
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        _rollAbility (event, actor, actionId) {
            actor.rollAbility(actionId, {event:event});
        }

        /**
         * Roll Save
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        _rollSave (event, actor, actionId) {
            actor.rollSave(actionId, {event:event});
        }

        /**
         * Roll Spell
         * @private
         * @param {object} actor The actor
         * @param {string} actionId The action id
         * @returns
         */
        _rollSpell (event, actor, actionId) {
            const spell = actor.items.get(actionId)
            actor.useSpell(spell, {configureDialog: !event.shiftKey});

            // Hooks.callAll('forceUpdateTokenActionHUD')
        }

        /**
         * Above is Ian's code
         * Below is pf2e code left as an example
         */

        /**
         * Perform Utility Macro
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async _performUtilityMacro (token, actionId) {
            switch (actionId) {
            case 'treatWounds':
                this._executeMacroById('6duZj0Ygiqv712rq')
                break
            case 'rest':
                this._executeMacroById('0GU2sdy3r2MeC56x')
                break
            case 'takeBreather':
                this._executeMacroById('aS6F7PSUlS9JM5jr')
                break
            case 'endTurn':
                if (game.combat?.current?.tokenId === token.id) await game.combat?.nextTurn()
                break
            }
        }

        /**
         * Execute Macro by ID
         * @private
         * @param {string} id The macro ID
         */
        async _executeMacroById (id) {
            const pack = game.packs.get('pf2e.pf2e-macros')
            pack.getDocument(id).then((e) => e.execute())
        }

        async _toggleCondition (actor, actionId) {
            if (this.rightClick) actor.decreaseCondition(actionId)
            else actor.increaseCondition(actionId)

            Hooks.callAll('forceUpdateTokenActionHUD')
        }
    }
})
