import { describe, it, expect } from 'vitest';
import {
  getMonstersForSubtype,
  normalizeType,
  findTypeData,
  groupSubtypesByType,
} from './monsterGrouping';

/* ------------------------------------------------------------------ */
/*  Fixture data                                                      */
/* ------------------------------------------------------------------ */

const fixtureMonsters = [
  { index: 'goblin', name: 'Goblin', type: 'Humanoid' },
  { index: 'bugbear', name: 'Bugbear', type: 'Humanoid' },
  { index: 'hobgoblin', name: 'Hobgoblin', type: 'Humanoid' },
  { index: 'kobold', name: 'Kobold', type: 'Humanoid' },
  { index: 'mind-flayer', name: 'Mind Flayer', type: 'Aberration' },
  {
    index: 'intellect-devourer',
    name: 'Intellect Devourer',
    type: 'Aberration',
  },
  { index: 'wisp', name: 'Wisp', type: 'Fey' },
  { index: 'will-o-wisp', name: 'Will-o-Wisp', type: 'Fey' },
  { index: 'gargoyle', name: 'Gargoyle', type: 'Elemental' },
  { index: 'mephitis', name: 'Mephitis', type: 'Elemental' },
];

const fixtureSubtypes = [
  {
    index: 'goblinoid',
    name: 'Goblinoid',
    type: 'Humanoid',
    monsters: ['goblin', 'kobold'],
  },
  {
    index: 'bugbear-like',
    name: 'Bugbear-like',
    type: 'Humanoid',
    monsters: ['bugbear'],
  },
  {
    index: 'mind-flayer-kind',
    name: 'Mind Flayer Kind',
    type: 'Humanoid',
    monsters: ['mind-flayer', 'intellect-devourer'],
  },
  {
    index: 'wisplike',
    name: 'Wisplike',
    type: 'Fey',
    monsters: ['wisp', 'will-o-wisp'],
  },
  {
    index: 'gargoyle-type',
    name: 'Gargoyle Type',
    type: 'Elemental',
    monsters: ['gargoyle', 'mephitis'],
  },
  {
    index: 'orphan-subtype',
    name: 'Orphan Subtype',
    type: 'Humanoid',
    monsters: ['nonexistent-monster'],
  },
  {
    index: 'empty-subtype',
    name: 'Empty Subtype',
    type: 'Humanoid',
    monsters: [],
  },
];

const fixtureTypesData = [
  {
    index: 'humanoid',
    name: 'Humanoid',
    desc: 'Humanoid creatures',
    monsters: ['goblin', 'bugbear', 'hobgoblin', 'kobold'],
  },
  {
    index: 'aberration',
    name: 'Aberration',
    desc: 'Alien creatures',
    monsters: ['mind-flayer', 'intellect-devourer'],
  },
  {
    index: 'fey',
    name: 'Fey',
    desc: 'Magical creatures',
    monsters: ['wisp', 'will-o-wisp'],
  },
  {
    index: 'elemental',
    name: 'Elemental',
    desc: 'Elemental beings',
    monsters: ['gargoyle', 'mephitis'],
  },
  {
    index: 'construct',
    name: 'Construct',
    desc: 'Artificial beings',
    monsters: [],
  },
];

/* ------------------------------------------------------------------ */
/*  normalizeType                                                     */
/* ------------------------------------------------------------------ */

describe('normalizeType', () => {
  it('converts "Humanoid" to "humanoid"', () => {
    expect(normalizeType('Humanoid')).toBe('humanoid');
  });

  it('converts "Monstrous Humanoid" to "monstrous-humanoid"', () => {
    expect(normalizeType('Monstrous Humanoid')).toBe('monstrous-humanoid');
  });

  it('handles empty input', () => {
    expect(normalizeType('')).toBe('');
  });

  it('handles undefined input', () => {
    expect(normalizeType(undefined)).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  getMonstersForSubtype                                             */
/* ------------------------------------------------------------------ */

describe('getMonstersForSubtype', () => {
  it('resolves indices to full monster objects', () => {
    const subtype = fixtureSubtypes[0]; // goblinoid
    const result = getMonstersForSubtype(subtype, fixtureMonsters);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Goblin');
    expect(result[1].name).toBe('Kobold');
  });

  it('returns empty array for missing monsters', () => {
    const subtype = fixtureSubtypes[5]; // orphan-subtype
    const result = getMonstersForSubtype(subtype, fixtureMonsters);
    expect(result).toEqual([]);
  });

  it('returns empty array for subtype with no monsters array', () => {
    const subtype = fixtureSubtypes[6]; // empty-subtype
    const result = getMonstersForSubtype(subtype, fixtureMonsters);
    expect(result).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/*  findTypeData                                                      */
/* ------------------------------------------------------------------ */

describe('findTypeData', () => {
  it('finds by normalized index', () => {
    const result = findTypeData(fixtureTypesData, 'humanoid');
    expect(result.name).toBe('Humanoid');
  });

  it('finds by normalized name', () => {
    const result = findTypeData(fixtureTypesData, 'aberration');
    expect(result.name).toBe('Aberration');
  });
});

/* ------------------------------------------------------------------ */
/*  groupSubtypesByType                                               */
/* ------------------------------------------------------------------ */

describe('groupSubtypesByType', () => {
  it('groups subtypes under the correct parent type via authoritative mapping', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    // The mind-flayer-kind subtype has type: "Humanoid" but its monsters
    // are listed under the Aberration type. The authoritative mapping
    // (resolveParentType) places it under Aberration.
    const aberrationGroup = result.find(g => g.name === 'Aberration');
    expect(aberrationGroup).toBeDefined();
    expect(aberrationGroup.subtypes).toHaveLength(1);
    expect(aberrationGroup.subtypes[0].index).toBe('mind-flayer-kind');
  });

  it('returns sorted array of type groups by name', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );
    const names = result.map(g => g.name);
    expect(names).toEqual([
      'Aberration',
      'Construct',
      'Elemental',
      'Fey',
      'Humanoid',
    ]);
  });

  it('populates monstersWithoutSubtype for types that have subtypes', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    // Humanoid has goblin, bugbear, hobgoblin, kobold.
    // goblinoid covers goblin + kobold.
    // bugbear-like covers bugbear.
    // hobgoblin is left without a subtype.
    const humanoidGroup = result.find(g => g.name === 'Humanoid');
    expect(humanoidGroup.monstersWithoutSubtype).toHaveLength(1);
    expect(humanoidGroup.monstersWithoutSubtype[0].name).toBe('Hobgoblin');
  });

  it('creates groups for types with no subtypes', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    // Construct has no subtypes and no monsters.
    const constructGroup = result.find(g => g.name === 'Construct');
    expect(constructGroup).toBeDefined();
    expect(constructGroup.subtypes).toEqual([]);
    expect(constructGroup.monstersWithoutSubtype).toEqual([]);
  });

  it('skips subtypes with no matching monsters', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    // orphan-subtype references 'nonexistent-monster' — no match.
    // empty-subtype has an empty monsters array.
    // Neither should appear in any group.
    const allSubtypes = result.flatMap(g => g.subtypes);
    const indices = allSubtypes.map(s => s.index);
    expect(indices).not.toContain('orphan-subtype');
    expect(indices).not.toContain('empty-subtype');
  });

  it('returns empty array when all inputs are empty', () => {
    const result = groupSubtypesByType([], [], []);
    expect(result).toEqual([]);
  });

  it('sets firstMonster on each subtype to the first matched monster', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    const humanoidGroup = result.find(g => g.name === 'Humanoid');
    const goblinoid = humanoidGroup.subtypes.find(
      s => s.index === 'goblinoid'
    );
    expect(goblinoid.firstMonster.name).toBe('Goblin');

    const bugbearLike = humanoidGroup.subtypes.find(
      s => s.index === 'bugbear-like'
    );
    expect(bugbearLike.firstMonster.name).toBe('Bugbear');
  });

  it('uses typeData.name as the display name', () => {
    const result = groupSubtypesByType(
      fixtureSubtypes,
      fixtureMonsters,
      fixtureTypesData
    );

    // Every group's name and type should come from the authoritative
    // typeData.name, not from the subtype's own type field.
    const aberrationGroup = result.find(g => g.name === 'Aberration');
    expect(aberrationGroup.type).toBe('Aberration');
    expect(aberrationGroup.name).toBe('Aberration');
  });
});
