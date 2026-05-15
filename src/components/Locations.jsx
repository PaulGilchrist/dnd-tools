
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocations } from '../data/dataService.js';
import { scrollIntoView } from '../data/utils';
import { renderHtmlContent } from '../utils/htmlUtils';
import './Locations.css';
import './common/Cover.css';

function Locations() {
    const [image, setImage] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive shownCard from URL params
    const shownCard = searchParams.get('index') || '';

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Fetch data
    const { data: locationsData, loading } = useLocations();

    const expandCard = (index) => {
        if (shownCard === index) {
            // Close the card
            setSearchParams({});
        } else {
            // Open the card
            setSearchParams({ index });
        }
    };

    const showImage = (locationIndex) => {
        // Show full-screen image when clicking the Image button
        const location = locationsData.find(loc => loc.index === locationIndex);
        if (location && location.image) {
            setImage(`${import.meta.env.BASE_URL}images/${location.image}`);
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
