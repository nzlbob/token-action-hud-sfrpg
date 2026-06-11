// System Module Imports
import { ACTION_TYPE } from './constants.js'
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        // Initialize actor and token variables
        actors = null
        actorId = null
        actorType = null
        tokenId = null

        // Initialize items variable
        items = null

        /**
         * Build System Actions
         * @override
         * @param {array} groupIds
         */
        async buildSystemActions(groupIds) {
        // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor];
            this.actorType = this.actor?.type;

            // Exit if actor is not required type
            const knownActors = [
                "character",
                "drone",
                "hazard",
                "npc2",
                "starship",
                "vehicle",
                "npc"
            ]

            if (this.actorType && !knownActors.includes(this.actorType)) return

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            // Set group variables
            this.groupIds = groupIds

            if (this.actorType === 'character') {
                await this._buildCharacterActions();
            }
            if (this.actorType === 'drone') {
                await this._buildDroneActions();
            }
            if (this.actorType === 'hazard') {
                await this._buildHazardActions();
            }
            if (this.actorType === 'npc2') {
                await this._buildNpc2Actions();
            }
            if (this.actorType === 'starship') {
                await this._buildStarshipActions();
            }
            if (this.actorType === 'vehicle') {
                await this._buildVehicleActions();
            }
            if (this.actorType === 'npc') {
                await this._buildNpcActions();
            }

            if (!this.actor) {
                this._buildMultipleTokenActions();
            }
        }

        /**
         * Build character actions
         * @private
         */
        async _buildCharacterActions() {
            this._buildEquipmentCategory();
            this._buildSkillCategory();
            this._buildSaveCategory();
            this._buildAbilityCategory();
            this._buildSpellCategory();
        }

        /**
         * Build character actions
         * @private
         */
        async _buildDroneActions() {
            this._buildEquipmentCategory();
            this._buildSkillCategory();
            this._buildSaveCategory();
            this._buildAbilityCategory();
        }

        /**
         * Build character actions
         * @private
         */
        async _buildHazardActions() {
            
        }

        /**
         * Build character actions
         * @private
         */
        async _buildNpc2Actions() {
            this._buildEquipmentCategory();
            this._buildSkillCategory();
            this._buildSaveCategory();
            this._buildAbilityCategory();
            this._buildSpellCategory();
        }

        /**
         * Build character actions
         * @private
         */
        async _buildStarshipActions() {
            
        }

        /**
         * Build character actions
         * @private
         */
        async _buildVehicleActions() {
            
        }

        /**
         * Build character actions
         * @private
         */
        async _buildNpcActions() {
            this._buildEquipmentCategory();
            this._buildSkillCategory();
            this._buildSaveCategory();
            this._buildAbilityCategory();
            this._buildSpellCategory();
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        _buildMultipleTokenActions() {

        }

        /**
         * Build equipment with actions
         */
        _buildEquipmentCategory() {
            const actionType = 'equipment';

            // Exit early if no items exist
            if (this.items.size === 0) return;

            // Filter equipment item types to only those that are relevant
            const equipmentTypes = ['weapon', 'shield', 'consumable'];
            const equipmentItems = new Map([...this.items].filter(item => equipmentTypes.includes(item[1].type)));

            // Create the Map for the equipment
            const equipmentMap = new Map();

            // Build a sub-map for each type of equipment
            for (const [key, value] of equipmentItems) {

                const equipmentType = value.type;

                // Add equipment to a map if appropriate
                if (!equipmentMap.has(equipmentType)) {
                    equipmentMap.set(equipmentType, new Map());
                }
                equipmentMap.get(equipmentType).set(key, value);
            }

            // Loop through inventory subcategory ids and add appropriate actions to each
            for (const [key, value] of equipmentMap) {

                // get the category
                const groupId = key;

                // Map of all stuff in the category
                const equipment = value;

                // Create group data
                const groupData = { id: groupId, type: 'system' };

                // Build actions
                this._addActions(equipment, groupData, actionType);
            }
        }

        /**
         * Build Skills
         */
        _buildSkillCategory() {
            const actionType = 'skill';

            const trainedSkills = new Map(Object.entries(this.actor.system.skills).filter(skill => {
                return skill[1].ranks;
            }));

            const untrainedSkills = new Map(Object.entries(this.actor.system.skills).filter(skill => {
                return (!skill[1].ranks && !skill[1].isTrainedOnly);
            }));
            
            for (const skill of trainedSkills) {
                skill[1].id = skill[0];
                skill[1].name = game.i18n.localize(CONFIG.SFRPG.skills[skill[0]]);
            }

            for (const skill of untrainedSkills) {
                skill[1].id = skill[0];
                skill[1].name = game.i18n.localize(CONFIG.SFRPG.skills[skill[0]]);
            }

            this._addActions(trainedSkills, { id: "trained", type: "system" }, actionType);
            this._addActions(untrainedSkills, { id: "untrained", type: "system" }, actionType);
        }

        /**
         * Build Saves
         */
        _buildSaveCategory() {
            const actionType = "save";

            // Build empty map for saves
            const saves = new Map();
            saves.set('fort', this.actor.system.attributes.fort);
            saves.set('reflex', this.actor.system.attributes.reflex);
            saves.set('will', this.actor.system.attributes.will);

            // Add in id's and localized names
            for (const [id, save] of saves) {
                save.id = id;
                save.name = game.i18n.localize(CONFIG.SFRPG.saves[id]);
            }

            // Add to the action list
            this._addActions(saves, {id: "save", type: "system"}, actionType);
        }

        /**
         * Build Abilities
         */
        _buildAbilityCategory() {
            const actionType = "ability";

            // Map of abilities
            const abilities = new Map(Object.entries(this.actor.system.abilities));
            
            // Add in id's and localized names
            for (const [id, ability] of abilities) {
                ability.id = id;
                ability.name = game.i18n.localize(CONFIG.SFRPG.abilities[id]);
            }

            // Add to the action list
            this._addActions(abilities, {id: "ability", type: "system"}, actionType);
        }

        /**
         * Build Spells
         */
        _buildSpellCategory() {
            const actionType = "spell";
            // const spellLevels = ["always", "innate", "0", "1", "2", "3", "4", "5", "6"];

            // Exit early if no items exist
            if (this.items.size === 0) return;

            // Filter items to only get spells
            const spells = new Map([...this.items].filter(item => item[1].type === "spell"));

            // Exit early if no spells exist
            if (spells.size === 0) return;

            // Create the Map for the spells
            const spellMap = new Map();

            // Build a sub-map for each spell level, including innate and always available spells
            for (const [key, value] of spells) {
                
                // set the level to the preparation mode if it has one
                const prepMode = value.system.preparation.mode
                let spellLevel = null;
                if (prepMode) {
                    spellLevel = prepMode;
                } else {
                    spellLevel = value.system.level.toString();
                }

                // Add equipment to a map if appropriate
                if (!spellMap.has(spellLevel)) {
                    spellMap.set(spellLevel, new Map());
                }
                spellMap.get(spellLevel).set(key, value);
            }

            // Loop through spell level submaps and add appropriate actions for each
            for (const [key, value] of spellMap) {

                // get the category
                const groupId = "spell".concat(key);

                // Map of all spells in this level
                const spell = value;

                // Create group data
                const groupData = { id: groupId, type: 'system' };

                // Build actions
                this._addActions(spell, groupData, actionType);
            }
        }

        /**
         * Build actions
         * @private
         * @param {object} items
         * @param {object} groupData
         * @param {string} actionType
         */
        async _addActions (items, groupData, actionType) {
            // Exit if there are no items
            if (items.size === 0) return;

            // Exit if there is no groupId
            const groupId = groupData?.id;
            if (!groupId) return;

            // Get actions
            const actions = [...items].map(item => this._getAction(actionType, item[1]));

            // Debug
            /*if (actionType === "spell") {
                console.log(items, groupData, actionType)
                console.log(actions)
            }*/

            // Add actions to action list
            await this.addActions(actions, groupData);
        }

        /**
         * Get Action
         * 
         * This takes the items that have been identified as needing to be added to the token action HUD and
         * returns the appropriate values for the token action hud core module to process them
         * @private
         * @param {string} actionType
         * @param {object} entity
         * @returns {object}
         */
        _getAction (actionType, entity) {

            const info = this._getItemInfo(entity);
            
            // get the id from id or _id, include the spell level if it's a spell
            const id = entity.id ?? entity._id;
            
            // get the entity's name
            const name = entity?.name ?? entity?.label;
            const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? '';
            
            const encodedValue = [actionType, id].join(this.delimiter);
            const cssClass = '';
            const img = coreModule.api.Utils.getImage(entity);
            const icon1 = '';
            const info1 = info?.info1;
            const info2 = info?.info2;
            const info3 = info?.info3;
            const listName = entity.listName ?? `${actionTypeName}${name}`;
            const systemSelected = entity?.systemSelected ?? null;

            // console.log([id, name, encodedValue, cssClass, img, icon1, info1, info2, info3, listName, systemSelected])
            return {
                id,
                name,
                encodedValue,
                cssClass,
                img,
                icon1,
                info1,
                info2,
                info3,
                listName,
                systemSelected
            }
        }

        /**
         * Get spell info
         * @param {object} spell The spell object
         * @returns {object}     The spell info
         */
        _getSpellInfo (spell) {
            const componentData = this._getComponentsInfo(spell)
            const usesData = this._getUsesData(spell)

            return {
                info1: componentData,
                info2: usesData
            }
        }

        /**
         * Get spell component info
         * @param {object} spell The spell object
         * @returns {string}     The spell components
         */
        _getComponentsInfo (spell) {
            const text = spell.components.value ?? spell.system.components?.value ?? ''
            const title = Object.entries(spell.components)
                .filter(component => component[1] === true)
                .map(component => { return component[0].trim().charAt(0).toUpperCase() + component[0].slice(1) })
                .join(', ')
            return { text, title }
        }

        /**
         * Get uses
         * @param {object} spell The spell
         * @returns {string}     The uses
         */
        _getUsesData (spell) {
            const value = spell?.uses?.value
            const max = spell?.uses?.max
            const text = (value && max >= 0) ? `${value}/${max}` : ''
            return { text }
        }

        /**
         * Get actors
         * @private
         * @returns {object}
         */
        _getActors () {
            const allowedTypes = [
                "character",
                "drone",
                "hazard",
                "npc2",
                "starship",
                "vehicle",
                "npc"
            ]
            const actors = canvas.tokens.controlled.map(token => token.actor)
            if (actors.every(actor => allowedTypes.includes(actor.type))) { return actors }
        }

        /**
         * Get item info
         * @private
         * @param {object} item
         * @returns {object}
         */
        _getItemInfo (item) {
            const quantityData = this._getQuantityData(item) ?? ''
            return {
                info1: { text: quantityData }
            }
        }

        /**
         * Get quantity
         * @private
         * @param {object} item
         * @returns {string}
         */
        _getQuantityData (item) {
            const quantity = item?.system?.quantity
            return (quantity > 1) ? quantity : ''
        }

        /** @protected */
        _foundrySort (a, b) {
            if (!(a?.sort || b?.sort)) return 0

            return a.sort - b.sort
        }
    }
})
