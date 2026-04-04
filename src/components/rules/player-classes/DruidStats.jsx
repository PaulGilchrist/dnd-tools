function DruidStats({ class_specific }) {
    if (!class_specific || class_specific.wild_shape_max_cr <= 0) return null;

    return (
        <div>
            <b>Wild Shape Max CR:</b>&nbsp;{class_specific.wild_shape_max_cr}
            {!class_specific.wild_shape_swim && <span>&nbsp;(no flying of swimming speed)</span>}
            {class_specific.wild_shape_swim && !class_specific.wild_shape_fly && (
                <span>&nbsp;(no flying speed)</span>
            )}
            <br />
        </div>
    );
}

export default DruidStats;
