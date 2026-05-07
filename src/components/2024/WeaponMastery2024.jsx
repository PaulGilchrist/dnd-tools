import { useWeaponMastery2024 } from '../../data/dataService';
import './WeaponMastery2024.css';

function WeaponMastery2024() {
    const { data: weaponsData, loading: weaponsLoading } = useWeaponMastery2024();

    if (weaponsLoading) {
        return <div className="list"><div>Loading weapon masteries...</div></div>;
    }

    return (
        <div className="list">
            {weaponsData.map((weapon) => (
                <div key={weapon.name} className="weapon-mastery-item" id={weapon.name}>
                    <div className="weapon-mastery-name">{weapon.name}</div>
                    <div className="weapon-mastery-description">{weapon.description}</div>
                </div>
            ))}
        </div>
    );
}

export default WeaponMastery2024;