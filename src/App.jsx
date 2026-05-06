import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { RuleVersionProvider } from './context/RuleVersionContext'
import { getBaseUrl } from './data/dataService'
import NavTop from './components/NavTop'
import './App.css'

// Lazy-loaded route components
const EquipmentItems = React.lazy(() => import('./components/equipment-items/EquipmentItems'));
const Locations = React.lazy(() => import('./components/Locations'));
const MagicItems = React.lazy(() => import('./components/magic-items/MagicItems'));
const Encounters = React.lazy(() => import('./components/monsters/Encounters'));
const MonsterSearch = React.lazy(() => import('./components/monsters/MonsterSearch'));
const MonsterLore = React.lazy(() => import('./components/monsters/MonsterLore'));
const Names = React.lazy(() => import('./components/names/Names'));
const Rules = React.lazy(() => import('./components/rules/Rules'));
const AbilityScores = React.lazy(() => import('./components/rules/AbilityScores'));
const PlayerClasses = React.lazy(() => import('./components/rules/player-classes/PlayerClasses'));
const Conditions = React.lazy(() => import('./components/rules/Conditions'));
const Feats = React.lazy(() => import('./components/rules/Feats'));
const Races = React.lazy(() => import('./components/rules/Races'));
const Spells = React.lazy(() => import('./components/spells/Spells'));
const Backgrounds2024 = React.lazy(() => import('./components/2024/rules/Backgrounds2024'));
const WeaponMastery2024 = React.lazy(() => import('./components/2024/WeaponMastery2024'));

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
                    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
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
                    </Suspense>
                </div>
            </BrowserRouter>
        </RuleVersionProvider>
    )
}

export default App
