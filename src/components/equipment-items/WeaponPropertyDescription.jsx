import { useState } from 'react';

function WeaponPropertyDescription({ category, property, getWeaponPropertyDescription }) {
    const [description] = useState(() => {
        if (category === 'Weapon' && property !== 'All') {
            return getWeaponPropertyDescription(property);
        }
        return '';
    });

    if (category !== 'Weapon' || property === 'All') {
        return null;
    }

    return (
        <div className="equipmentItems-weapon-property-description">
            <b>Weapon Property - {property}</b><br />
            {description}
        </div>
    );
}

export default WeaponPropertyDescription;
