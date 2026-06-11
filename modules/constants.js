/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-sfrpg'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2'

/**
 * Action type
 */
export const ACTION_TYPE = {
    attribute: 'tokenActionHud.pf2e.attribute',
    equipment: 'Equipment',
    feat: 'PF2E.Item.Feat.LevelLabel',
    save: 'tokenActionHud.pf2e.save',
    skill: 'PF2E.SkillLabel',
    spell: 'ITEM.TypeSpell',
    utility: 'tokenActionHud.utility'
}

/**
 * Skill abbreviations
 */
export const SKILL_ABBREVIATION = {
    acrobatics: 'acr',
    athletics: 'ath',
    bluff: 'blu',
    computers: 'com',
    culture: 'cul',
    diplomacy: 'dip',
    disguide: 'dis',
    engineering: 'eng',
    intimidation: 'itm',
    lifeScience: 'lsc',
    medicine: 'med',
    mysticism: 'mys',
    perception: 'per',
    physicalScience: 'phs',
    piloting: 'pil',
    profession: 'pro',
    senseMotive: 'sen',
    sleightOfHand: 'sle',
    stealth: 'ste',
    survival: 'sur'
}

// All the potential types of actions go here
export const GROUP = {
    ability: { id: 'ability', name: 'Abilities', type: 'system' },
    consumable: { id: 'consumable', name: 'Consumables', type: 'system' },
    equipment: { id: 'equipment', name: 'Equipment', type: 'system' },
    save: { id: 'save', name: 'Saves', type: 'system' },
    shield: { id: 'shield', name: 'Shields', type: 'system' },
    spellalways: { id: 'spellalways', name: 'Always Available', type: 'system' },
    spellinnate: { id: 'spellinnate', name: 'Innate', type: 'system' },
    spell0: { id: 'spell0', name: 'Level 0', type: 'system' },
    spell1: { id: 'spell1', name: 'Level 1', type: 'system' },
    spell2: { id: 'spell2', name: 'Level 2', type: 'system' },
    spell3: { id: 'spell3', name: 'Level 3', type: 'system' },
    spell4: { id: 'spell4', name: 'Level 4', type: 'system' },
    spell5: { id: 'spell5', name: 'Level 5', type: 'system' },
    spell6: { id: 'spell6', name: 'Level 6', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    trained: { id: 'trained', name: 'Trained Skills', type: 'system' },
    untrained: { id: 'untrained', name: 'Untrained Skills', type: 'system' },
    weapon: { id: 'weapon', name: 'Weapons', type: 'system' }
}
