import React, { useRef, useEffect } from 'react';
import './Map.css';

const Map = props => {
    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        // NOTE: with the help of useEffect, this block of code runs after the JSX code is executed.
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({ position: center, map: map });

    }, [center, zoom]);

    return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
};

export default Map;