import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [pin, setPin] = useState({
    latitude: -37.8136,
    longitude: 144.9631,
  });
  const [isLoading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false); // Set loading to false if permission denied
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false); // Set loading to false once location is obtained
    })();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? ( // Render a loading indicator while obtaining location
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pin.latitude,
            longitude: pin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onUserLocationChange={(e) => {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        >
          <Marker
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            title="Your Location"
            draggable={true}
            onDragEnd={(e) => {
              setPin({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
