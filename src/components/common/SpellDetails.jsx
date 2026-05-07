import { renderHtmlContent } from '../../utils/htmlUtils';
import { getClasses } from '../../utils/spellUtils';

/**
 * SpellDetails - Renders the expanded body of a spell card
 * Extracted from SpellCard
 */
function SpellDetails({ spell }) {
    const renderComponents = () => {
        if (!spell.components) {
            return null;
        }
        
        if (typeof spell.components === 'string') {
            return spell.components;
        }
        
        if (Array.isArray(spell.components) && spell.components.length > 0) {
            const componentMap = {
                'V': 'Verbal',
                'S': 'Somatic',
                'M': 'Material'
            };
            
            return spell.components.map((component) => (
                <span key={component} className="component-badge">
                    {componentMap[component] || component}
                </span>
            ));
        }
        
        return null;
    };

    const renderDamage = () => {
        if (!spell.damage) {
            return null;
        }

        const damageType = spell.damage.damage_type;
        const damageText = spell.damage.damage_at_slot_level
            ? Object.entries(spell.damage.damage_at_slot_level)
                .map(([level, damage]) => `At Higher Levels: ${damage} (level ${level})`)
                .join('<br>')
            : null;

        return (
            <div>
                <b>Damage Type:</b>&nbsp;{damageType}<br />
                {damageText && (
                    <div dangerouslySetInnerHTML={renderHtmlContent(damageText)} />
                )}
            </div>
        );
    };

    const renderHigherLevel = () => {
        if (!spell.higherLevel) {
            return null;
        }

        if (typeof spell.higherLevel === 'string') {
            return (
                <div>
                    <br /><b>At higher levels.</b>&nbsp;{spell.higherLevel}<br />
                </div>
            );
        }

        if (Array.isArray(spell.higherLevel) && spell.higherLevel.length > 0) {
            return (
                <div>
                    <br /><b>At higher levels.</b>&nbsp;
                    {spell.higherLevel.map((levelText) => (
                        <div key={levelText}>{levelText}</div>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="card-body">
            <div className="card-text">
                <div className="stats">
                    <div>
                        <b>Casting Time:</b>&nbsp;{spell.castingTime}<br />
                        <b>Range:</b>&nbsp;{spell.range}<br />
                        <b>Components:</b>&nbsp;{renderComponents()}
                        {spell.material && (
                            <span>({spell.material})</span>
                        )}<br />
                        <b>Duration:</b>&nbsp;{spell.concentration && (
                            <span>Concentration,&nbsp;</span>
                        )}{spell.duration}<br />
                    </div>
                    <div>
                        <b>Classes:</b>&nbsp;{getClasses(spell)}<br />
                        {spell.subclasses && spell.subclasses.length > 0 && (
                            <div><b>Subclasses:</b>&nbsp;{spell.subclasses.join(', ')}<br /></div>
                        )}
                        {spell.areaOfEffect && (
                            <div><b>Area of Effect:</b>&nbsp;{spell.areaOfEffect.size} foot {spell.areaOfEffect.type}<br /></div>
                        )}
                        {renderDamage()}
                        {spell.savingThrow && (
                            <div><b>Saving Throw:</b>&nbsp;{spell.savingThrow}<br /></div>
                        )}
                        {spell.statusEffects && spell.statusEffects.length > 0 && (
                            <div><b>Status Effects:</b>&nbsp;{spell.statusEffects.join(', ')}<br /></div>
                        )}
                    </div>
                </div>

                <hr />

                {spell.desc && spell.desc.length > 0 && spell.desc.map((desc) => (
                    <div key={desc}>
                        <span dangerouslySetInnerHTML={renderHtmlContent(desc)} />
                    </div>
                ))}

                {renderHigherLevel()}
            </div>
        </div>
    );
}

export default SpellDetails;
