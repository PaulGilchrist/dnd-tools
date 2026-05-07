/**
 * Common MonsterLegendaryActions component - Displays legendary actions
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 */
function MonsterLegendaryActions({ monster }) {
    if (!monster || !monster.legendaryActions || monster.legendaryActions.length === 0) {
        return null;
        }

    return (
           <div>
               {monster.legendaryActions.find(a => a.name)?.uses ? `Monster can take ${monster.legendaryActions.find(a => a.name)?.uses} legendary actions, only one at a time. At the end of another creature's turn, the monster can take one of the following actions.` : ''}
                {monster.legendaryActions.map((legendaryAction) => (
                    <span key={legendaryAction.name}>
                       <b>{legendaryAction.name}:</b>&nbsp;
                       {legendaryAction.renderDescription && <span dangerouslySetInnerHTML={legendaryAction.renderDescription()} />}
                       <br />
                   </span>
               ))}
           </div>
       );
}

export default MonsterLegendaryActions;