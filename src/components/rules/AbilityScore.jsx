import { renderHtmlContent } from '../../utils/htmlUtils';

function AbilityScore({ abilityScore, expand, onExpand }) {
    const isExpanded = expand;

    const getSkills = () => {
        if (!abilityScore.skills || abilityScore.skills.length === 0) {
            return '';
        }
        const skills = abilityScore.skills.join(', ');
        return skills;
    };

    const toggleDetails = () => {
        onExpand(!isExpanded);
    };

    if (!abilityScore) {
        return null;
    }

    const skills = getSkills();

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div>
                    <span className="card-title">
                        {abilityScore.full_name}
                    </span>
                    <div className="skills-column">
                        {skills && (
                            <span>
                                &nbsp;- {skills}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="card-body">
                    <div 
                                            className="card-text"
                                            dangerouslySetInnerHTML={renderHtmlContent(abilityScore.desc)}
                                         />
                </div>
            )}
        </div>
    );
}

export default AbilityScore;
