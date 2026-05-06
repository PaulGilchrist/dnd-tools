import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { RuleVersionProvider } from './context/RuleVersionContext'
import { getBaseUrl } from './data/dataService'
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
import Backgrounds2024 from './components/2024/rules/Backgrounds2024'
import WeaponMastery2024 from './components/2024/WeaponMastery2024'
import './App.css'

function App() {
    // Get the base path - Vite sets BASE_URL based on vite.config.js
    // Using lazy evaluation to avoid issues in test environments
    const base = getBaseUrl() || '/';

    return (
        <RuleVersionProvider>
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
                    {/* 2024-only features (no 5e equivalent) */}
                    <Route path="/2024/rules/backgrounds" element={<Backgrounds2024 />} />
                    <Route path="/2024/backgrounds" element={<Navigate to="/2024/rules/backgrounds" replace />} />
                    <Route path="/2024/rules/weapon-mastery" element={<WeaponMastery2024 />} />
                    <Route path="/2024/weapon-mastery" element={<Navigate to="/2024/rules/weapon-mastery" replace />} />

                    {/* Redirects from old /2024/ paths to unified routes */}
                    <Route path="/2024/spells" element={<Navigate to="/spells" replace />} />
                    <Route path="/2024/monsters/search" element={<Navigate to="/monsters/search" replace />} />
                    <Route path="/2024/monsters/lore" element={<Navigate to="/monsters/lore" replace />} />
                    <Route path="/2024/magic-items" element={<Navigate to="/magic-items" replace />} />
                    <Route path="/2024/rules/classes" element={<Navigate to="/rules/classes" replace />} />
                    <Route path="/2024/classes" element={<Navigate to="/rules/classes" replace />} />
                    <Route path="/2024/rules/races" element={<Navigate to="/rules/races" replace />} />
                    <Route path="/2024/races" element={<Navigate to="/rules/races" replace />} />
                    <Route path="/2024/rules/feats" element={<Navigate to="/rules/feats" replace />} />
                    <Route path="/2024/feats" element={<Navigate to="/rules/feats" replace />} />
                </Routes>
                </div>
            </BrowserRouter>
        </RuleVersionProvider>
    )
}

export default App