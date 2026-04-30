import { useState, useEffect } from 'react';

/**
 * Common SpellCard component - Displays spell details
 * Works with normalized spell data from both 5e and 2024 versions
 * @param {object} spell - The normalized spell data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onKnownChange - Callback when known status changes
 * @param {function} onPreparedChange - Callback when prepared status changes
 */
function SpellCard({ spell, expand, onExpand, onKnownChange, onPreparedChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

     // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
          }
      }, [expand]);

    const getClasses = () => {
        if (!spell.classes || spell.classes.length === 0) {
            return '';
          }
        let classes = '';
        spell.classes.forEach((spellClass) => {
            classes += `${spellClass}, `;
          });
        return classes.substring(0, classes.length - 2);
      };

    const getLevelText = (level) => {
        switch (level) {
            case 0:
                return 'Cantrip';
            case 1:
                return '1st-level';
            case 2:
                return '2nd-level';
            case 3:
                return '3rd-level';
            default:
                return level + 'th-level';
          }
      };

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
      };

    const toggleKnown = () => {
        spell.known = !spell.known;
        
         // A spell must be known to be prepared
        if (spell.known === false && spell.prepared === true) {
            spell.prepared = false;
            onPreparedChange(spell.index, false);
          }
        
        onKnownChange(spell.index, spell.known);
      };

    const togglePrepared = () => {
        spell.prepared = !spell.prepared;
        onPreparedChange(spell.index, spell.prepared);
      };

    if (!spell) {
        return null;
      }

     // Handle HTML sanitization (simplified - in production use DOMPurify or similar)
    const sanitizeHtml = (htmlString) => {
        if (!htmlString) return '';
         // Simple approach: just return the string
         // In production, use DOMPurify: https://www.npmjs.com/package/dompurify
        return htmlString;
      };

    const renderDescription = () => {
        if (!spell.desc || spell.desc.length === 0) {
            return null;
          }

        return spell.desc.map((desc, index) => (
             <div key={index}>
                 <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(desc) }} />
             </div>
         ));
      };

    const renderComponents = () => {
        if (!spell.components) {
            return null;
          }
        
         // 5e format: components is a string like "V S M"
        if (typeof spell.components === 'string') {
            return spell.components;
          }
        
         // 2024 format: components is an array ['V', 'S', 'M']
        if (Array.isArray(spell.components) && spell.components.length > 0) {
            const componentMap = {
                'V': 'Verbal',
                'S': 'Somatic',
                'M': 'Material'
              };
            
            return spell.components.map((component, index) => (
                <span key={index} className="component-badge">
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
                     <div dangerouslySetInnerHTML={{ __html: damageText }} />
                 )}
             </div>
         );
      };

    const renderSavingThrow = () => {
        if (!spell.savingThrow) {
            return null;
          }

        return (
             <div>
                 <b>Saving Throw:</b>&nbsp;{spell.savingThrow}<br />
             </div>
         );
      };

    const renderAreaOfEffect = () => {
        if (!spell.areaOfEffect) {
            return null;
          }

        const aoe = spell.areaOfEffect;
        return (
             <div>
                 <b>Area of Effect:</b>&nbsp;{aoe.size} foot {aoe.type}<br />
             </div>
         );
      };

    const renderSubclasses = () => {
        if (!spell.subclasses || spell.subclasses.length === 0) {
            return null;
          }

        return (
             <div>
                 <b>Subclasses:</b>&nbsp;{spell.subclasses.join(', ')}<br />
             </div>
         );
      };

    const renderStatusEffects = () => {
        if (!spell.statusEffects || spell.statusEffects.length === 0) {
            return null;
          }

        return (
             <div>
                 <b>Status Effects:</b>&nbsp;{spell.statusEffects.join(', ')}<br />
             </div>
         );
      };

    const renderHigherLevel = () => {
        if (!spell.higherLevel) {
            return null;
          }

         // 5e format: higherLevel is a string
        if (typeof spell.higherLevel === 'string') {
            return (
                <div>
                    <br /><b>At higher levels.</b>&nbsp;{spell.higherLevel}<br />
                </div>
            );
          }

         // 2024 format: higherLevel is an array
        if (Array.isArray(spell.higherLevel) && spell.higherLevel.length > 0) {
            return (
                <div>
                    <br /><b>At higher levels.</b>&nbsp;
                    {spell.higherLevel.map((levelText, index) => (
                        <div key={index}>{levelText}</div>
                    ))}
                </div>
            );
          }

        return null;
      };

    return (
          <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={spell.index}>
              <div className="card-header clickable">
                  <div onClick={toggleDetails}>
                      <div className="card-title">{spell.name}</div>
                      <i>{getLevelText(spell.level)}&nbsp;{spell.school && spell.school.toLowerCase()}</i>
                      {spell.ritual && (
                          <span> (ritual)</span>
                      )}<br />
                  </div>
                  <div>
                      <div className="form-check">
                          <input 
                             className="form-check-input" 
                             type="checkbox" 
                             id="prepared" 
                             name="prepared"
                             disabled={spell.known !== true}
                             checked={spell.prepared || false}
                             onChange={togglePrepared}
                          />
                          <label className="form-check-label" htmlFor="prepared">
                             Prepared
                          </label>
                      </div>
                      <div className="form-check">
                          <input 
                             className="form-check-input" 
                             type="checkbox" 
                             id="known" 
                             name="known"
                             checked={spell.known || false}
                             onChange={toggleKnown}
                          />
                          <label className="form-check-label" htmlFor="known">
                             Known
                          </label>
                      </div>
                  </div>
              </div>

              {isExpanded && (
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
                                  <b>Classes:</b>&nbsp;{getClasses()}<br />
                                  {renderSubclasses()}
                                  {renderAreaOfEffect()}
                                  {renderDamage()}
                                  {renderSavingThrow()}
                                  {renderStatusEffects()}
                              </div>
                          </div>

                          <hr />

                          {renderDescription()}

                          {renderHigherLevel()}
                      </div>
                  </div>
              )}
          </div>
      );
}

export default SpellCard;