
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocations } from '../data/dataService';
import { scrollIntoView } from '../data/utils';
import { renderHtmlContent } from '../utils/htmlUtils';
import './Locations.css';
import './common/Cover.css';

// Import all location images dynamically
const locationImages = import.meta.glob('../assets/locations/*.jpg', { eager: true });

function Locations() {
    const [image, setImage] = useState('');
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: locationsData, loading } = useLocations();

    // Handle URL index parameter
    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            const index = params.get('index');
            if (index) {
                const location = data.find(loc => loc.index === index);
                if (location) {
                    setShownCard(index);
                    // Scroll after state update completes
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            }
        }
    };

    const expandCard = (index) => {
        if (shownCard === index) {
            // Close the card
            setShownCard('');
        } else {
            // Open the card
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
        }

        // Update URL query params using setSearchParams
        if (shownCard === index) {
            // Closing, remove query param
            setSearchParams({});
        } else {
            // Opening, add query param
            setSearchParams({ index });
        }
    };

    const showImage = (locationIndex) => {
        // Show full-screen image when clicking the Image button
        const location = locationsData.find(loc => loc.index === locationIndex);
        if (location && location.image) {
            // Use relative path to look up in locationImages object
            const imagePath = `../assets/locations/${location.image}`;
            setImage(locationImages[imagePath]?.default || '');
        }
    };

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(locationsData, searchParams);
    }, [locationsData, searchParams]);

    if (loading) {
        return <div className="list"><div>Loading locations...</div></div>;
    }

    return (
        <>
            {image && (
                <div className="cover-overlay" onClick={() => setImage('')}>
                    {image && (
                        <img src={image} alt="Location map" />
                    )}
                </div>
            )}
            
            <div className="list">
                {locationsData.map((location) => (
                    <div key={location.index} id={location.index}>
                        {/* Scroll anchor - must be in document flow */}
                        <div
                            id={`scroll-anchor-${location.index}`}
                            className="locations-scroll-anchor"
                        ></div>
                        <div 
                            className={`card outer w-100 ${shownCard === location.index ? 'active' : ''}`} 
                            id={location.index}
                        >
                            <div 
                                className="card-header clickable" 
                                id={`${location.index}-header`}
                                onClick={() => expandCard(location.index)}
                            >
                                <div>
                                    <div className="card-title">{location.name}</div>
                                    <i>{location.type}</i><br />
                                </div>
                            </div>
                            
                            {shownCard === location.index && (
                                <div className="card-body" id={`${location.index}-body`}>
                                    <div className="location-stats">
                                        <div>
                                            {/* no stats */}
                                        </div>
                                        <div>
                                            {location.image && (
                                                <button 
                                                    type="button" 
                                                    className="btn btn-primary" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showImage(location.index);
                                                    }}
                                                >
                                                    Image
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div dangerouslySetInnerHTML={renderHtmlContent(location.desc)}></div>
                                    <br />
                                    {location.book && `(${location.book} page ${location.page})`}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Locations;
