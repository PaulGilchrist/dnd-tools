function PlayerClassBasicInfo({ playerClass, getNameString }) {
    if (!playerClass) return null;

    return (
        <div className="card-body">
            {playerClass.desc}<br /><br />
            <b>Hit Die:</b>&nbsp;d{playerClass.hit_die}<br />
            
            {playerClass.proficiencies && playerClass.proficiencies.length > 0 && (
                <div>
                    <b>Proficiencies:</b>&nbsp;{getNameString(playerClass.proficiencies)}<br />
                </div>
            )}

            {playerClass.proficiency_choices && playerClass.proficiency_choices.length > 0 && (
                <div>
                    <b>Proficiencies:</b>&nbsp;Choose {playerClass.proficiency_choices[0].choose} -
                    {getNameString(playerClass.proficiency_choices[0].from)}
                </div>
            )}

            {playerClass.saving_throws && playerClass.saving_throws.length > 0 && (
                <div>
                    <b>Saving Throws:</b>&nbsp;{getNameString(playerClass.saving_throws)}<br />
                </div>
            )}

            <b>Starting Wealth:</b>&nbsp;{playerClass.starting_wealth}<br />
        </div>
    );
}

export default PlayerClassBasicInfo;
