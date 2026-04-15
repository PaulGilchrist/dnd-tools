import SelectFilter from '../../../components/monsters/SelectFilter';
import NameInput from '../../../components/monsters/NameInput';

// Size options for 2024 monsters
const SIZE_OPTIONS = [
    { value: 'All', label: 'All Sizes' },
    { value: 'Tiny', label: 'Tiny' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
    { value: 'Huge', label: 'Huge' },
    { value: 'Gargantuan', label: 'Gargantuan' }
];

// Type options for 2024 monsters
const TYPE_OPTIONS = [
    { value: 'All', label: 'All Types' },
    { value: 'Aberration', label: 'Aberration' },
    { value: 'Beast', label: 'Beast' },
    { value: 'Celestial', label: 'Celestial' },
    { value: 'Construct', label: 'Construct' },
    { value: 'Dragon', label: 'Dragon' },
    { value: 'Elemental', label: 'Elemental' },
    { value: 'Fey', label: 'Fey' },
    { value: 'Fiend', label: 'Fiend' },
    { value: 'Giant', label: 'Giant' },
    { value: 'Humanoid', label: 'Humanoid' },
    { value: 'Monstrosity', label: 'Monstrosity' },
    { value: 'Ooze', label: 'Ooze' },
    { value: 'Plant', label: 'Plant' },
    { value: 'Undead', label: 'Undead' }
];

/**
 * Monster2024FilterControls component - Filter controls for 2024 monsters
 * @param {object} filter - Current filter state
 * @param {function} updateFilter - Function to update filter state
 */
function Monster2024FilterControls({ filter, updateFilter }) {
    const handleBookmarkedChange = (value) => {
        updateFilter({ ...filter, bookmarked: value });
    };

    const handleSizeChange = (value) => {
        updateFilter({ ...filter, size: value });
    };

    const handleTypeChange = (value) => {
        updateFilter({ ...filter, type: value });
    };

    const handleChallengeMinChange = (value) => {
        updateFilter({ ...filter, challengeRatingMin: parseInt(value, 10) });
    };

    const handleChallengeMaxChange = (value) => {
        updateFilter({ ...filter, challengeRatingMax: parseInt(value, 10) });
    };

    const handleXpMinChange = (value) => {
        updateFilter({ ...filter, xpMin: parseInt(value, 10) });
    };

    const handleXpMaxChange = (value) => {
        updateFilter({ ...filter, xpMax: parseInt(value, 10) });
    };

    return (
        <>
            {/* Name */}
            <NameInput
                filter={filter}
                updateFilter={updateFilter}
            />

            {/* Size */}
            <SelectFilter
                label="Size"
                name="size"
                value={filter.size}
                options={SIZE_OPTIONS}
                onChange={handleSizeChange}
            />

            {/* Type */}
            <SelectFilter
                label="Type"
                name="type"
                value={filter.type}
                options={TYPE_OPTIONS}
                onChange={handleTypeChange}
            />

            {/* Challenge Rating */}
            <label htmlFor="challengeRatingMin" className="col-form-label">Challenge Rating</label>
            <div className="row">
                <div className="col">
                    <input
                        type="number"
                        className="form-control"
                        id="challengeRatingMin"
                        name="challengeRatingMin"
                        value={filter.challengeRatingMin}
                        onChange={(e) => handleChallengeMinChange(e.target.value)}
                        min="0"
                        max="30"
                        step="0.25"
                        placeholder="min"
                    />
                </div>
                <div className="col">
                    <input
                        type="number"
                        className="form-control"
                        id="challengeRatingMax"
                        name="challengeRatingMax"
                        value={filter.challengeRatingMax}
                        onChange={(e) => handleChallengeMaxChange(e.target.value)}
                        min="0"
                        max="30"
                        step="0.25"
                        placeholder="max"
                    />
                </div>
            </div>

            {/* XP Range */}
            <label htmlFor="xpMin" className="col-form-label">XP Range</label>
            <div className="row">
                <div className="col">
                    <input
                        type="number"
                        className="form-control"
                        id="xpMin"
                        name="xpMin"
                        value={filter.xpMin}
                        onChange={(e) => handleXpMinChange(e.target.value)}
                        min="0"
                        max="100000"
                        step="25"
                        placeholder="min"
                    />
                </div>
                <div className="col">
                    <input
                        type="number"
                        className="form-control"
                        id="xpMax"
                        name="xpMax"
                        value={filter.xpMax}
                        onChange={(e) => handleXpMaxChange(e.target.value)}
                        min="0"
                        max="100000"
                        step="25"
                        placeholder="max"
                    />
                </div>
            </div>

            {/* Bookmarked */}
            <SelectFilter
                label="Bookmarked"
                name="bookmarked"
                value={filter.bookmarked}
                options={[
                    { value: 'All', label: 'All' },
                    { value: 'true', label: 'Bookmarked Only' },
                    { value: 'false', label: 'Not Bookmarked' }
                ]}
                onChange={handleBookmarkedChange}
            />
        </>
    );
}

export default Monster2024FilterControls;
