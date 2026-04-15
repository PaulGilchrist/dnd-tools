import fs from 'fs';
import path from 'path';

const mainMonstersPath = path.join(import.meta.dirname, '../public/data/monsters.json');
const monsters2024Path = path.join(import.meta.dirname, '../public/data/2024/monsters.json');

try {
  // Read the main monsters file
  const mainMonstersData = fs.readFileSync(mainMonstersPath, 'utf8');
  const mainMonsters = JSON.parse(mainMonstersData);

  // Read the 2024 monsters file
  const monsters2024Data = fs.readFileSync(monsters2024Path, 'utf8');
  const monsters2024 = JSON.parse(monsters2024Data);

  // Create a map of main monsters for quick lookup by name
  const mainMonstersMap = new Map();
  mainMonsters.forEach(monster => {
    if (monster.name && monster.image) {
      mainMonstersMap.set(monster.name, monster.image);
    }
  });

  // Update 2024 monsters with images from main monsters
  let updatedCount = 0;
  monsters2024.forEach(monster => {
    if (monster.name && mainMonstersMap.has(monster.name)) {
      const imageUrl = mainMonstersMap.get(monster.name);
      if (imageUrl) {
        monster.image = imageUrl;
        updatedCount++;
      }
    }
  });

  // Write the updated 2024 monsters back to the file
  fs.writeFileSync(monsters2024Path, JSON.stringify(monsters2024, null, 2), 'utf8');

  console.log(`Successfully updated ${updatedCount} monster images in public/data/2024/monsters.json`);
} catch (error) {
  console.error('Error processing monster files:', error);
  process.exit(1);
}
