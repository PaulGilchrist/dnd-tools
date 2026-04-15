import { useState } from 'react';
import './EquipmentItem.css';

function EquipmentItem({ equipmentItem, expand, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    if (expand !== isExpanded) {
        setIsExpanded(expand);
    }

    const getContents = () => {
        if (!equipmentItem.contents || equipmentItem.contents.length === 0) {
            return '';
        }
        const contents = equipmentItem.contents.map(content => 
            `${content.quantity} ${content.item.name}`
        ).join(', ');
        return contents;
    };

    const getProperties = () => {
        if (!equipmentItem.properties || equipmentItem.properties.length === 0) {
            return '';
        }
        return equipmentItem.properties.join(', ');
    };

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleBookmark = () => {
        equipmentItem.bookmarked = !equipmentItem.bookmarked;
        onBookmarkChange(equipmentItem.index, equipmentItem.bookmarked);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        equipmentItem.bookmarked = e.target.checked;
        onBookmarkChange(equipmentItem.index, equipmentItem.bookmarked);
    };

    const handleLabelClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    if (!equipmentItem) {
        return null;
    }

    // Handle "Meele" typo in data
    const weaponRange = equipmentItem.weapon_range?.toLowerCase().replace('meele', 'melee');

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={equipmentItem.index}>
            <div className="card-header clickable">
                <div onClick={toggleDetails}>
                    <div className="card-title">{equipmentItem.name}</div>
                    <div>
                        <i>{equipmentItem.equipment_category}, cost {equipmentItem.cost.quantity} {equipmentItem.cost.unit}</i>
                        {equipmentItem.weight && (
                            <span>, weight {equipmentItem.weight} lb.</span>
                        )}
                    </div>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`bookmarked-${equipmentItem.index}`}
                        checked={equipmentItem.bookmarked || false}
                        onChange={handleCheckboxChange}
                    />
                    <label 
                        className="form-check-label" 
                        htmlFor={`bookmarked-${equipmentItem.index}`}
                        onClick={handleLabelClick}
                    >
                        Bookmarked
                    </label>
                </div>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <div className="card-text">
                        {/* Adventuring Gear */}
                        {equipmentItem.equipment_category === 'Adventuring Gear' && (
                            <div>
                                <b>Category:</b>&nbsp;{equipmentItem.gear_category}<br />
                                {equipmentItem.contents && (
                                    <div>
                                        <b>Contents:</b>&nbsp;{getContents()}<br />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Armor */}
                        {equipmentItem.equipment_category === 'Armor' && (
                            <div>
                                <b>Category:</b>&nbsp;{equipmentItem.armor_category}<br />
                                <b>Armor Class:</b>&nbsp;{equipmentItem.armor_class?.base}
                                {equipmentItem.armor_class?.dex_bonus === true && (
                                    <span>&nbsp;+ DEX bonus</span>
                                )}
                                {equipmentItem.armor_class?.max_bonus !== null && equipmentItem.armor_class?.max_bonus !== undefined && (
                                    <span>&nbsp;(max {equipmentItem.armor_class.max_bonus})</span>
                                )}<br />
                                {equipmentItem.str_minimum > 0 && (
                                    <div>
                                        <b>Strength Min:</b>&nbsp;{equipmentItem.str_minimum}<br />
                                    </div>
                                )}
                                {equipmentItem.stealth_disadvantage === true && (
                                    <div>
                                        <b>Disadvantages:</b>&nbsp;Stealth<br />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mounts and Vehicles */}
                        {equipmentItem.equipment_category === 'Mounts and Vehicles' && (
                            <div>
                                <b>Category:</b>&nbsp;{equipmentItem.vehicle_category}<br />
                                {equipmentItem.speed && (
                                    <div>
                                        <b>Speed:</b>&nbsp;{equipmentItem.speed.quantity} {equipmentItem.speed.unit} ({equipmentItem.speed.quantity * 24} miles per day)<br />
                                    </div>
                                )}
                                {equipmentItem.capacity && (
                                    <div>
                                        <b>Capacity:</b>&nbsp;{equipmentItem.capacity}<br />
                                    </div>
                                )}
                                {equipmentItem.armor_class && (
                                    <div>
                                        <b>Armor Class:</b>&nbsp;{equipmentItem.armor_class}<br />
                                    </div>
                                )}
                                {equipmentItem.hit_points && (
                                    <div>
                                        <b>Hit Points:</b>&nbsp;{equipmentItem.hit_points}<br />
                                    </div>
                                )}
                                {equipmentItem['damage-threshold'] && (
                                    <div>
                                        <b>Damage Threshold:</b>&nbsp;{equipmentItem['damage-threshold']}<br />
                                    </div>
                                )}
                                {equipmentItem.crew && (
                                    <div>
                                        <b>Crew:</b>&nbsp;{equipmentItem.crew}<br />
                                    </div>
                                )}
                                {equipmentItem.passengers && (
                                    <div>
                                        <b>Passengers:</b>&nbsp;{equipmentItem.passengers}<br />
                                    </div>
                                )}
                                {equipmentItem.cargo && (
                                    <div>
                                        <b>Cargo:</b>&nbsp;{equipmentItem.cargo.quantity}&nbsp;{equipmentItem.cargo.unit}<br />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Property */}
                        {equipmentItem.equipment_category === 'Property' && (
                            <div>
                                <b>Construction Time:</b>&nbsp;{equipmentItem.construction_time.quantity} {equipmentItem.construction_time.unit}<br />
                                <b>Maintenance Cost:</b>&nbsp;{equipmentItem.maintenance_cost.quantity} {equipmentItem.maintenance_cost.unit} {equipmentItem.maintenance_cost.interval}<br />
                                <b>Skilled Hirelings:</b>&nbsp;{equipmentItem.skilled_hirelings}<br />
                                <b>Unskilled Hirelings:</b>&nbsp;{equipmentItem.untrained_hirelings}<br />
                            </div>
                        )}

                        {/* Tools */}
                        {equipmentItem.equipment_category === 'Tools' && (
                            <div>
                                <b>Category:</b>&nbsp;{equipmentItem.tool_category}<br />
                            </div>
                        )}

                        {/* Weapon */}
                        {equipmentItem.equipment_category === 'Weapon' && (
                            <div>
                                <b>Category:</b>&nbsp;{equipmentItem.weapon_category}<br />
                                {weaponRange === 'melee' && (
                                    <div>
                                        <b>Range:</b>&nbsp;Melee<br />
                                    </div>
                                )}
                                {weaponRange === 'ranged' && (
                                    <div>
                                        <b>Range:</b>&nbsp;normal {equipmentItem.range?.normal} feet, long {equipmentItem.range?.long} feet<br />
                                    </div>
                                )}
                                <b>Damage:</b>&nbsp;{equipmentItem.damage?.damage_dice} {equipmentItem.damage?.damage_type?.name}<br />
                                {equipmentItem.two_handed_damage && (
                                    <div>
                                        <b>Two Handed Damage:</b>&nbsp;{equipmentItem.two_handed_damage.damage_dice} {equipmentItem.two_handed_damage.damage_type?.name}<br />
                                    </div>
                                )}
                                {equipmentItem.throw_range && (
                                    <div>
                                        <b>Throw Range:</b>&nbsp;normal {equipmentItem.throw_range.normal} feet, long {equipmentItem.throw_range.long} feet<br />
                                    </div>
                                )}
                                {equipmentItem.properties && equipmentItem.properties.length > 0 && (
                                    <div>
                                        <b>Properties:</b>&nbsp;{getProperties()}<br />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description and Special */}
                        {equipmentItem.desc && (
                            <div>
                                <hr />
                                <h5>Description</h5>
                                {equipmentItem.desc.map((desc, index) => (
                                    <span key={index}>
                                        {desc}<br /><br />
                                    </span>
                                ))}
                            </div>
                        )}

                        {equipmentItem.special && (
                            <div>
                                <hr />
                                <h5>Special</h5>
                                {equipmentItem.special.map((spec, index) => (
                                    <span key={index}>
                                        {spec}<br /><br />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EquipmentItem;
