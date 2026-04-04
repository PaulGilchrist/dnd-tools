import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavTop from './components/NavTop'
import EquipmentItems from './components/equipment-items/EquipmentItems'
import Locations from './components/Locations'
import MagicItems from './components/magic-items/MagicItems'
import Encounters from './components/monsters/Encounters'
import MonsterSearch from './components/monsters/MonsterSearch'
import MonsterLore from './components/monsters/MonsterLore'
import Names from './components/Names'
import Rules from './components/rules/Rules'
import AbilityScores from './components/rules/AbilityScores'
import PlayerClasses from './components/rules/player-classes/PlayerClasses'
import Conditions from './components/rules/Conditions'
import Feats from './components/rules/Feats'
import Races from './components/rules/Races'
import './App.css'

function App() {
  return (
    <Router>
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
        <Route path="/spells" element={<div>Spells Component</div>} />
      </Routes>
      </div>
    </Router>
  )
}

export default App

