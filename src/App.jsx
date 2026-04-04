import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavTop from './components/NavTop'
import EquipmentItems from './components/EquipmentItems'
import Locations from './components/Locations'
import MagicItems from './components/MagicItems'
import Encounters from './components/Encounters'
import MonsterSearch from './components/MonsterSearch'
import MonsterLore from './components/MonsterLore'
import Names from './components/Names'
import Rules from './components/Rules'
import RulesItem from './components/RulesItem'
import AbilityScores from './components/AbilityScores'
// import GeneralRules from './components/rules/general-rules/GeneralRules'
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
        <Route path="/rules/classes" element={<div>Player Classes Component</div>} />
        <Route path="/rules/conditions" element={<div>Conditions Component</div>} />
        <Route path="/rules/feats" element={<div>Feats Component</div>} />
        <Route path="/rules/races" element={<div>Races Component</div>} />
        <Route path="/spells" element={<div>Spells Component</div>} />
      </Routes>
      </div>
    </Router>
  )
}

export default App

