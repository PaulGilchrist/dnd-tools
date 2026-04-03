import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavTop from './components/NavTop'
import EquipmentItems from './components/EquipmentItems'
import Locations from './components/Locations'
import MagicItems from './components/MagicItems'
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
        <Route path="/monster/encounters" element={<div>Encounters Component</div>} />
        <Route path="/monster/lore" element={<div>Monster Lore Component</div>} />
        <Route path="/monster/search" element={<div>Monster Search Component</div>} />
        <Route path="/names" element={<div>Names Component</div>} />
        <Route path="/rules/general" element={<div>General Rules Component</div>} />
        <Route path="/rules/ability-scores" element={<div>Ability Scores Component</div>} />
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

