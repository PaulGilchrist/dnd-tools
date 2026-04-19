import { useState, useEffect } from 'react';
import { useWeaponMastery2024 } from '../../data/dataService';
import './WeaponMastery2024.css';

function WeaponMastery2024() {
    const [weapons, setWeapons] = useState([]);
    const { data: weaponsData, loading: weaponsLoading } = useWeaponMastery2024();

    useEffect(() => {
        if (weaponsData && weaponsData.length > 0) {
            setWeapons(weaponsData);
            console.log(`${weaponsData.length} weapon masteries`);
        }
    }, [weaponsData]);

    if (weaponsLoading) {
        return <div className="list"><div>Loading weapon masteries...</div></div>;
    }

    return (
        <div className="list">
            {weapons.map((weapon) => (
                <div key={weapon.name} className="weapon-mastery-item" id={weapon.name}>
                    <div className="weapon-mastery-name">{weapon.name}</div>
                    <div className="weapon-mastery-description">{weapon.description}</div>
                </div>
            ))}
        </div>
    );
}

export default WeaponMastery2024;