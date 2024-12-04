import React, {SetStateAction, useEffect, Dispatch} from 'react';
import {Loader} from '@googlemaps/js-api-loader';
import classes from './googleMap.module.scss';
import {MapError} from '../googleMapModal';

export const GoogleMap = ({
  address,
  setMapError
}: {
  address?: string;
  setMapError: Dispatch<SetStateAction<MapError>>;
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey as string,
      version: 'weekly'
    });
    loader.importLibrary('maps').then(() => {
      new google.maps.Geocoder().geocode(
        {address: address},
        (results, status) => {
          if (status === 'OK' && results) {
            const map = new google.maps.Map(
              document.getElementById('maps') as HTMLElement,
              {
                center: results[0].geometry.location,
                zoom: 14
              }
            );
            const locationMarker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            const centerMarkerImage =
              'https://w5j7r3b6.stackpathcdn.com/static/fnsite/assets/img/functions/cd-icon-location.png';

            const centerMarker = new google.maps.Marker({
              position: map.getCenter(),
              map: map,
              title: 'Marker Title',
              icon: centerMarkerImage
            });

            google.maps.event.addListener(map, 'center_changed', () => {
              const newCenter = map.getCenter();
              centerMarker.setPosition(newCenter);
            });
          } else {
            setMapError(MapError.failure);
            console.error(
              `Geocode was not successful for the following reason: ${status}`
            );
          }
        }
      );
    });
  }, [address]);

  return <div className={classes.mapsContainer} id="maps" />;
};
