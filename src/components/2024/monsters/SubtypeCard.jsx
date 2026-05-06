import { renderHtmlContent } from '../../../utils/htmlUtils';
import Monster2024 from './Monster2024';

/**
 * SubtypeCard - Renders a single subtype card with its monsters
 * Extracted from MonsterLore2024
 */
function SubtypeCard({ subtype, shownCard, shownMonster, expandCard, expandMonsterCard }) {
    const isExpanded = shownCard === subtype.index;
    
    return (
        <div className="inner-list" key={subtype.index} id={subtype.index}>
            <div 
                className={`card w-100 ${isExpanded ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); expandCard(subtype.index, !isExpanded); }}
            >
                <div className="card-header clickable">
                    <div>
                        <div className="card-title">{subtype.name}</div>
                        <i>
                            {subtype.firstMonster?.size} {subtype.firstMonster?.type?.toLowerCase()}
                            {subtype.firstMonster?.subtype && subtype.firstMonster.subtype !== subtype.firstMonster.type && (
                                <span> ({subtype.firstMonster.subtype})</span>
                            )}
                        </i>
                    </div>
                </div>
                {isExpanded && (
                    <div className="card-body" onClick={(e) => e.stopPropagation()}>
                        {subtype['short-description'] && (
                            <div>
                                <strong>Short Description:</strong> {subtype['short-description']}
                            </div>
                        )}
                        {subtype.habitat && (
                            <div>
                                <strong>Habitat:</strong> {subtype.habitat}
                            </div>
                        )}
                        {subtype.desc && (
                            <div>
                                <strong>Description:</strong>
                                <div dangerouslySetInnerHTML={renderHtmlContent(subtype.desc)} />
                            </div>
                        )}
                        <h6>Monsters in this subtype</h6>
                        {subtype.monsters.map(innerMonster => (
                            <Monster2024 
                                key={innerMonster.index}
                                monster={innerMonster}
                                expand={shownMonster === innerMonster.index}
                                onExpand={(expanded) => expandMonsterCard(innerMonster.index, expanded)}
                                cardType="inner"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubtypeCard;
