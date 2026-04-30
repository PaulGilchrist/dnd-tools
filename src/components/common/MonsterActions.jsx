import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Common MonsterActions component - Displays monster actions, traits, and lair actions
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 * @param {string} sectionType - The type of section to display: 'actions', 'traits', or 'lairActions'
 */
function MonsterActions({ monster, sectionType = 'actions' }) {
    if (!monster) {
        return null;
       }

    let items = [];
    if (sectionType === 'actions') {
        items = monster.actions || [];
      } else if (sectionType === 'traits') {
        items = monster.traits || [];
      } else if (sectionType === 'lairActions') {
        items = monster.lairActions || [];
      }

    if (items.length === 0) {
        return null;
      }

    return (
         <div>
              {items.map((item, index) => (
                  <div key={index}>
                      <b>
                          {item.name}
                          {/* 5e usage format */}
                          {item.usage && item.usage.type === 'recharge on roll' && (
                              <span>&nbsp;(Recharge {item.usage.min_value}-6)</span>
                          )}
                          {item.usage && item.usage.type === 'per day' && (
                              <span>&nbsp;({item.usage.times}/Day)</span>
                          )}
                          {/* 2024 recharge format */}
                          {item.recharge && item.recharge !== 'Recharge 5-6' && (
                              <span>&nbsp;(Recharge {item.recharge})</span>
                          )}
                          {item.recharge === 'Recharge 5-6' && (
                              <span>&nbsp;(Recharge 5-6)</span>
                          )}
                          :
                      </b>&nbsp;
                      {item.renderDescription && <span dangerouslySetInnerHTML={item.renderDescription()} />}
                      {/* 2024-specific attack and save info */}
                      {item.attackBonus && (
                          <span>
                             Atk: +{item.attackBonus} ({item.damageDice || 'melee'}) — {item.damage || 'damage'}
                          </span>
                      )}
                      {item.saveDc && (
                          <span>
                             DC {item.saveDc} {item.saveType} save or {item.saveEffect}
                          </span>
                      )}
                  <br/>
                  </div>
              ))}
          </div>
      );
}

export default MonsterActions;