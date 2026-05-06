const navRoutes = [
  { type: 'link', key: 'equipment', label: 'Equipment', path: '/equipment-items' },
  { type: 'link', key: 'locations', label: 'Locations', path: '/locations' },
  { type: 'link', key: 'magic-items', label: 'Magic Items', path: '/magic-items' },
  {
    type: 'dropdown',
    key: 'monsters',
    label: 'Monsters',
    items: [
      { label: 'Encounters', path: '/monsters/encounters' },
      { label: 'Lore', path: '/monsters/lore' },
      { label: 'Search', path: '/monsters/search' },
    ],
  },
  { type: 'link', key: 'names', label: 'Names', path: '/names' },
  {
    type: 'dropdown',
    key: 'rules',
    label: 'Rules',
    items: [
      { label: 'General', path: '/rules/general' },
      { label: 'Abilities', path: '/rules/ability-scores' },
      { label: 'Backgrounds', path: '/2024/backgrounds', requiredVersion: '2024' },
      { label: 'Classes', path: '/rules/classes' },
      { label: 'Conditions', path: '/rules/conditions' },
      { label: 'Feats', path: '/rules/feats' },
      { label: 'Races', path: '/rules/races' },
      { label: 'Weapon Mastery', path: '/2024/weapon-mastery', requiredVersion: '2024' },
    ],
  },
  { type: 'link', key: 'spells', label: 'Spells', path: '/spells' },
];

export default navRoutes;
