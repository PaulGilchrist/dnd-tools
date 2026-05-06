import { renderHtmlContent } from '../../../../utils/htmlUtils';
import '../../../common/index.css';
import { getAbilityBonuses, getLanguages } from '../../../../utils/raceUtils';
import { RaceTraits, RaceSubraces, RaceLineages } from './RaceComponents2024';

function RaceItem2024({ race, expand, onExpand }) {
    const toggleDetails = () => {
        onExpand(!expand);
    };

    if (!race) {
        return null;
    }

    return (
        <div className={`card w-100 ${expand ? 'active' : ''}`} id={race.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div>
                    <div className="card-title">{race.name}</div>
                    <div>
                        <i><b>Size:</b> {race.size}, <b>Speed:</b> {race.speed} feet</i>
                    </div>
                </div>
            </div>

            {expand && (
                <div className="card-body">
                    {race.description && (
                        <div className="description-section">
                            <div dangerouslySetInnerHTML={renderHtmlContent(race.description)} />
                        </div>
                    )}

                    <div>
                        {getAbilityBonuses(race) && (
                            <div className="raceItem2024-ability-bonus">
                                <b>Ability Bonuses:</b>&nbsp;{getAbilityBonuses(race)}<br />
                            </div>
                        )}

                        <div className="raceItem2024-speed">
                            <b>Speed:</b>&nbsp;{race.speed} feet<br />
                        </div>

                        {race.size && (
                            <div className="raceItem2024-size">
                                <b>Size:</b>&nbsp;{race.size}<br />
                            </div>
                        )}

                        {race.age && (
                            <div className="raceItem2024-age">
                                <b>Age:</b>&nbsp;{race.age}<br />
                            </div>
                        )}

                        {race.alignment && (
                            <div className="raceItem2024-alignment">
                                <b>Alignment:</b>&nbsp;{race.alignment}<br />
                            </div>
                        )}
                    </div>

                    {getLanguages(race) && (
                        <div className="raceItem2024-languages">
                            <b>Languages:</b>&nbsp;{getLanguages(race)}<br />
                        </div>
                    )}

                    <RaceTraits race={race} />
                    <RaceSubraces race={race} />
                    <RaceLineages race={race} />

                    {race.book && (
                        <div className="book-reference">
                            <b>Source:</b>&nbsp;{race.book} (page {race.page})
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RaceItem2024;
