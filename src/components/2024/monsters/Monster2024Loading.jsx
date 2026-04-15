/**
 * Monster2024Loading component - Loading indicator for 2024 monsters
 */
function Monster2024Loading() {
    return (
        <div className="list">
            <div className="loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="loading-text">Loading 2024 monsters...</span>
            </div>
        </div>
    );
}

export default Monster2024Loading;