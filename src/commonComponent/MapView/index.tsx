import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import darkMapStyle from '../../screens/darkMapStyle';
import { useValues } from '../../../App';
import { appColors } from '@src/themes';
import Images from '@utils/images';
import { WebView } from 'react-native-webview';
import { styles } from './style';
import { external } from '@src/styles/externalStyle';
import { useSelector } from 'react-redux';

export function Map({ userLocation, driverLocation, onDurationChange }) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [region, setRegion] = useState(null);
  const { isDark } = useValues();
  const [mapType, setMapType] = useState('googleMap');
  const { taxidoSettingData } = useSelector((state) => state.setting);
  const { translateData } = useSelector((state: any) => state.setting);




  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);


  useEffect(() => {
    if (userLocation && driverLocation) {
      const userLatLng = {
        latitude: parseFloat(userLocation.lat),
        longitude: parseFloat(userLocation.lng)
      };
      const driverLatLng = {
        latitude: parseFloat(driverLocation.lat),
        longitude: parseFloat(driverLocation.lng)
      };

      const minLat = Math.min(userLatLng.latitude, driverLatLng.latitude);
      const maxLat = Math.max(userLatLng.latitude, driverLatLng.latitude);
      const minLng = Math.min(userLatLng.longitude, driverLatLng.longitude);
      const maxLng = Math.max(userLatLng.longitude, driverLatLng.longitude);

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.abs(maxLat - minLat) * 1.5,
        longitudeDelta: Math.abs(maxLng - minLng) * 1.5,
      });
    }
  }, [userLocation, driverLocation]);


  useEffect(() => {
    if (routeCoordinates.length > 0) {
      let minLat = routeCoordinates[0].latitude;
      let maxLat = routeCoordinates[0].latitude;
      let minLng = routeCoordinates[0].longitude;
      let maxLng = routeCoordinates[0].longitude;

      routeCoordinates.forEach(coord => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLng = Math.min(minLng, coord.longitude);
        maxLng = Math.max(maxLng, coord.longitude);
      });

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.abs(maxLat - minLat) * 1.2,
        longitudeDelta: Math.abs(maxLng - minLng) * 1.2,
      });
    }
  }, [routeCoordinates]);

  const mapCustomStyle = isDark ? darkMapStyle : '';


  const userLatLng = userLocation ? {
    latitude: parseFloat(userLocation.lat),
    longitude: parseFloat(userLocation.lng)
  } : null;

  const driverLatLng = driverLocation ? {
    latitude: parseFloat(driverLocation.lat),
    longitude: parseFloat(driverLocation.lng)
  } : null;


  const mapHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>OpenStreetMap with Routing</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
      <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          var map = L.map('map').setView([${driverLocation?.lat}, ${driverLocation?.lng}], 13);
          
          L.tileLayer('http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var startPoint = [${driverLocation?.lat}, ${driverLocation?.lng}];
          var endPoint = [${userLocation?.lat}, ${userLocation?.lng}];

          var startMarker = L.marker(startPoint, { draggable: false }).addTo(map).bindPopup('Start Point');
          var endMarker = L.marker(endPoint, { draggable: false }).addTo(map).bindPopup('End Point');

          var waypoints = [L.latLng(startPoint), L.latLng(endPoint)];

          L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            createMarker: function() { return null; }
          }).addTo(map);

          map.fitBounds(L.latLngBounds(waypoints));
        });
      </script>
    </body>
  </html>
`;

  return (
    <View style={external.main}>
      {mapType === 'googleMap' ? (
        <MapView
          style={external.main}
          region={region}
          showsUserLocation={true}
          customMapStyle={mapCustomStyle}
        >
          {userLatLng && (
            <Marker coordinate={userLatLng} title={translateData?.userLocationMapText} >
              <View style={styles.driverMarker}>
                <Image
                  source={Images.car}
                  style={styles.marker}
                />
              </View>
            </Marker>
          )}

          {driverLatLng && (
            <Marker coordinate={driverLatLng} title={translateData?.driverLocationMapText}>

            </Marker>
          )}

          {userLatLng && driverLatLng && (
            <MapViewDirections
              origin={driverLatLng}
              destination={userLatLng}
              apikey={taxidoSettingData?.taxido_values?.location?.google_map_api_key}
              strokeColor={appColors.primary}
              strokeWidth={3}
              onReady={(result) => {
                setRouteCoordinates(result.coordinates);
                setDistance(result.distance);
                if (onDurationChange) {
                  onDurationChange(result.duration);
                }
              }}
            />
          )}

          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={appColors.primary}
              strokeWidth={3}
            />
          )}
        </MapView>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={external.main}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </View>
  );
};
