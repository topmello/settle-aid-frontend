import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
  const [pin, setPin] = React.useState({
      latitude: -37.840935  ,
      longitude: 144.946457,
  });
  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
       initialRegion={{
        latitude: pin.latitude,
        longitude: pin.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      >
        <Marker 
        coordinate={{latitude: pin.latitude,
        longitude: pin.longitude,}}
        title="Your Location"
        draggable={true}
        onDragStart={(e) => {
          
        }}
        onDragEnd={(e) => {
          setPin({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          })
        }}
        ></Marker>
      </MapView>
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
});
