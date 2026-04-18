import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Get the base path - Vite sets BASE_URL based on vite.config.js 'base' option
// For GitHub Pages at https://PaulGilchrist.github.io/dnd-tools/, 
const base = import.meta.env.BASE_URL || '/'

import NavTop from './components/NavTop'
import EquipmentItems from './components/equipment-items/EquipmentItems'
import Locations from './components/Locations'
import MagicItems from './components/magic-items/MagicItems'
import Encounters from './components/monsters/Encounters'
import MonsterSearch from './components/monsters/MonsterSearch'
import MonsterLore from './components/monsters/MonsterLore'
import Names from './components/names/Names'
import Rules from './components/rules/Rules'
import AbilityScores from './components/rules/AbilityScores'
import PlayerClasses from './components/rules/player-classes/PlayerClasses'
import Conditions from './components/rules/Conditions'
import Feats from './components/rules/Feats'
import Races from './components/rules/Races'
import Spells from './components/spells/Spells'
import Spells2024 from './components/2024/spells/Spells'
import Monster2024Search from './components/2024/monsters/Monster2024Search'
import MonsterLore2024 from './components/2024/monsters/MonsterLore2024'
import MagicItems2024 from './components/2024/magic-items/MagicItems2024'
import PlayerClasses2024 from './components/2024/rules/player-classes/PlayerClasses2024'
import Races2024 from './components/2024/rules/races/Races2024'
import Backgrounds2024 from './components/2024/rules/Backgrounds2024'
import './App.css'

function App() {
  return (
    <BrowserRouter basename={base}>
      <NavTop />
      <div className="main-content">
        {/* Redirect root to spells, matching Angular routing */}
        <Routes>
        <Route path="/" element={<Navigate to="/spells" replace />} />
        <Route path="/equipment-items" element={<EquipmentItems />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/magic-items" element={<MagicItems />} />
        <Route path="/monsters/encounters" element={<Encounters />} />
        <Route path="/monsters/lore" element={<MonsterLore />} />
        <Route path="/monsters/search" element={<MonsterSearch />} />
        <Route path="/names" element={<Names />} />
        <Route path="/rules/general" element={<Rules />} />
        <Route path="/rules/ability-scores" element={<AbilityScores />} />
        <Route path="/rules/classes" element={<PlayerClasses />} />
        <Route path="/rules/conditions" element={<Conditions />} />
        <Route path="/rules/feats" element={<Feats />} />
        <Route path="/rules/races" element={<Races />} />
        <Route path="/spells" element={<Spells />} />
        <Route path="/2024/spells" element={<Spells2024 />} />
        <Route path="/2024/monsters/search" element={<Monster2024Search />} />
        <Route path="/2024/monsters/lore" element={<MonsterLore2024 />} />
        <Route path="/2024/magic-items" element={<MagicItems2024 />} />
        <Route path="/2024/rules/classes" element={<PlayerClasses2024 />} />
        <Route path="/2024/classes" element={<Navigate to="/2024/rules/classes" replace />} />
        <Route path="/2024/rules/races" element={<Races2024 />} />
                <Route path="/2024/races" element={<Navigate to="/2024/rules/races" replace />} />
                <Route path="/2024/rules/backgrounds" element={<Backgrounds2024 />} />
                <Route path="/2024/backgrounds" element={<Navigate to="/2024/rules/backgrounds" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App