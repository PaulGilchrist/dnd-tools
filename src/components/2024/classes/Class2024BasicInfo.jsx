function Class2024BasicInfo({ playerClass, getNameString }) {
    if (!playerClass || !playerClass.core_traits) return null;

    const ct = playerClass.core_traits;

    return (
        <div className="core-traits card w-100" style={{ marginBottom: '1rem' }}>
            <div className="card-header">
                <div className="card-title">Core Traits</div>
            </div>
            <div className="card-body">
                {ct.primary_ability && (
                    <div>
                        <b>Primary Ability:</b>&nbsp;{ct.primary_ability}
                    </div>
                )}
                {ct.hit_point_die && (
                    <div>
                        <b>Hit Die:</b>&nbsp;{ct.hit_point_die}
                    </div>
                )}
                {ct.saving_throw_proficiencies && (
                    <div>
                        <b>Saving Throw Proficiencies:</b>&nbsp;{ct.saving_throw_proficiencies}
                    </div>
                )}
                {ct.skill_proficiencies && (
                    <div>
                        <b>Skill Proficiencies:</b>&nbsp;{ct.skill_proficiencies}
                    </div>
                )}
                {ct.weapon_proficiencies && (
                    <div>
                        <b>Weapon Proficiencies:</b>&nbsp;{ct.weapon_proficiencies}
                    </div>
                )}
                {ct.armor_training && (
                    <div>
                        <b>Armor Training:</b>&nbsp;{ct.armor_training}
                    </div>
                )}
                {ct.tool_proficiencies && (
                    <div>
                        <b>Tool Proficiencies:</b>&nbsp;{ct.tool_proficiencies}
                    </div>
                )}
                {ct.starting_equipment && (
                    <div>
                        <b>Starting Equipment:</b>&nbsp;{ct.starting_equipment}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Class2024BasicInfo;