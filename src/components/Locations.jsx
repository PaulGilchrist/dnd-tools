
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
    const [locations, setLocations] = useState([]);
    const [image, setImage] = useState('');
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: locationsData, loading } = useLocations();

    useEffect(() => {
        if (locationsData && locationsData.length > 0) {
            setLocations(locationsData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const location = locationsData.find(loc => loc.index === index);
                if (location) {
                    setShownCard(index);
                    // Scroll into view after a small delay to ensure element is rendered
                    setTimeout(() => scrollIntoView(index), 100);
                }
            }
        }
    }, [locationsData, searchParams]);

    // Scroll into view when card is expanded
    useEffect(() => {
        if (shownCard) {
            // Use a longer timeout to ensure the card body has fully rendered
            setTimeout(() => scrollIntoView(shownCard), 300);
        }
    }, [shownCard]);

    const expandCard = (index) => {
        if (shownCard === index) {
            // Close the card
            setShownCard('');
        } else {
            // Open the card
            setShownCard(index);
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
        const location = locations.find(loc => loc.index === locationIndex);
        if (location && location.image) {
            // Use relative path to look up in locationImages object
            const imagePath = `../assets/locations/${location.image}`;
            setImage(locationImages[imagePath]?.default || '');
        }
    };

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
                {locations.map((location) => (
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
