import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavTop from './components/NavTop'
import EquipmentItems from './components/EquipmentItems'
import './App.css'

function App() {
  return (
    <Router>
      <NavTop />
      <Routes>
        {/* Redirect root to spells, matching Angular routing */}
        <Route path="/" element={<Navigate to="/spells" replace />} />
        <Route path="/equipment-items" element={<EquipmentItems />} />
        <Route path="/locations" element={<div>Locations Component</div>} />
        <Route path="/magic-items" element={<div>Magic Items Component</div>} />
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
    </Router>
  )
}

export default App
