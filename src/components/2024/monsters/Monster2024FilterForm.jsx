/**
 * Monster2024FilterForm component - Wrapper for filter controls
 * @param {object} children - Filter control components
 */
function Monster2024FilterForm({ children }) {
    return (
        <form className="filter-form">
            {children}
        </form>
    );
}

export default Monster2024FilterForm;