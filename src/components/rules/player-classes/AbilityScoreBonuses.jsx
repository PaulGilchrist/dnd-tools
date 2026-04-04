function AbilityScoreBonuses({ ability_score_bonuses }) {
    if (ability_score_bonuses === undefined || ability_score_bonuses <= 0) {
        return null;
    }

    return (
        <div>
            <b>Ability Score Bonuses:</b>&nbsp;{ability_score_bonuses}<br />
        </div>
    );
}

export default AbilityScoreBonuses;
