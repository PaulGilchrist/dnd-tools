import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocations } from '../data/dataService';
import { scrollIntoView } from '../data/utils';
import './Locations.css';

// Get the base URL from Vite's environment variables (set by vite.config.js)
const BASE_URL = import.meta.env.BASE_URL || '';

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
                    scrollIntoView(index);
                }
            }
        }
    }, [locationsData]);

    const expandCard = (index) => {
        if (shownCard === index) {
            // Close the card
            setShownCard('');
        } else {
            // Open the card
            setShownCard(index);
            scrollIntoView(index);
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
            // Use BASE_URL to construct absolute path for GitHub Pages
            const imagePath = `${BASE_URL}assets/locations/${location.image}`;
            setImage(locationImages[imagePath]?.default || '');
        }
    };

    if (loading) {
        return <div className="list"><div>Loading locations...</div></div>;
    }

    return (
        <>
            {image && (
                <div className="cover" onClick={() => setImage('')}>
                    <img src={image} alt="Location map" />
                </div>
            )}
            
            <div className="list">
                {locations.map((location) => (
                    <div key={location.index} id={location.index}>
                        <div 
                            className={`card outer w-100 ${shownCard === location.index ? 'active' : ''}`} 
                            id={location.index}
                        >
                            <div className="card-header clickable" onClick={() => expandCard(location.index)}>
                                <div>
                                    <div className="card-title">{location.name}</div>
                                    <i>{location.type}</i><br />
                                </div>
                            </div>
                            
                            {shownCard === location.index && (
                                <div className="card-body">
                                    <div className="stats">
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
                                    <div dangerouslySetInnerHTML={{ __html: location.desc }}></div>
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
