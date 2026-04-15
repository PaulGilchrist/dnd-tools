import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024Actions component - Displays monster actions
 * @param {object} monster - The monster data object
 */
function Monster2024Actions({ monster }) {
    if (!monster || !monster.actions) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            {monster.actions.map((action, index) => (
                <div key={index}>
                    <b>
                        {action.name}
                        {action.recharge && action.recharge !== 'Recharge 5-6' && (
                            <span>&nbsp;(Recharge {action.recharge})</span>
                        )}
                        {action.recharge === 'Recharge 5-6' && (
                            <span>&nbsp;(Recharge 5-6)</span>
                        )}
                        :
                    </b>&nbsp;{action.description}<br />
                    {action.attack_bonus && <span>Atk: +{action.attack_bonus} ({action.damage_dice || 'melee'}) — {action.damage || 'damage'}</span>}
                    {action.save_dc && <span>DC {action.save_dc} {action.save_type} save or {action.save_effect}</span>}
                    <br /><br />
                </div>
            ))}
        </div>
    );
}

export default Monster2024Actions;