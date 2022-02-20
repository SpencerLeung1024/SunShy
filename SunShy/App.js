import * as React from 'react';
import { useState, useEffect } from "react";
import MapView from 'react-native-maps';
import { StyleSheet, Text, Button, View, Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import { render } from 'react-dom';

const App = () => {
  const [grantedLocationPermission, setGrantedLocationPermission] = useState(true)
  const [currentLatitude, setCurrentLatitude] = useState(49.3); // useState creates a variable that can be used in React.
  const [currentLongitude, setCurrentLongitude] = useState(-122.9); // Same for longitude.
  const [currentRegion, setCurrentRegion] = useState(() => { // Region used by the map.
    return {
      latitude: currentLatitude, // Default coordinates.
      longitude: currentLongitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25 * (9.0 / 16.0)
    };
  })

  async function updateLocation() {
/*
    let { status } = Location.requestForegroundPermissionsAsync();
    //Alert.alert(status + Location.getForegroundPermissionsAsync());
    if (status !== 'granted') {
      //setErrorMsg('Permission to access location was denied');
      // Doesn't work for some reason.
      //return;
      // return causes it to exit out
    }
    */
    //let location = Location.getCurrentPositionAsync({});
    if (grantedLocationPermission == false) {
      Alert.alert("Location not granted.");
      return;
    }
    let location = await Location.getLastKnownPositionAsync();
    if (location == null) {
      Alert.alert("Location not available.");
      return;
    }
    setCurrentLatitude(location.coords.latitude);
    setCurrentLongitude(location.coords.longitude);
    /*
    setCurrentRegion({
      latitude: currentLatitude,
      longitude: currentLongitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25 * (9.0 / 16.0)
    });
    */
    //map.animateToRegion(currentRegion);
    //setState();
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGrantedLocationPermission(false);
        Alert.alert("The app requires location permission.")
      } else {
        setGrantedLocationPermission(true);
      }
    })();
    setInterval(updateLocation, 5000);
  }, []); // Runs only on the first render.

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        showsUserLocation={true}
        followUserLocation={true}
      />
      <Text>Nice argument. Unfortunately,</Text>
      <Text>Latitude: {currentLatitude}</Text>
      <Text>Longitude: {currentLongitude}</Text>
      <Text>Location updates every 5 seconds.</Text>
      <Button onPress={updateLocation} title = "Press to update now."/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.75,
  },
});

export default App;

