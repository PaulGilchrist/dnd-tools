function ProficiencyBonus({ prof_bonus }) {
    if (prof_bonus === undefined) {
        return null;
    }

    return (
        <div>
            <b>Proficiency Bonus:</b>&nbsp;{prof_bonus}<br />
        </div>
    );
}

export default ProficiencyBonus;
