import * as React from 'react';
import { useState, useEffect } from "react";
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyABSrEMbXv69aQ5IczL3ZzBbnDBAGo-1bs");

export default function App () {
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [park, setPark] = useState({lat: 0, lng: 0});
  const [parkName, setName] = useState(" ")
  const [state, setState] = useState({isReady: false},);

  async function loadData() {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let lat = location.coords.latitude;
      let lng = location.coords.longitude;
      setLat(lat);
      setLng(lng);
      Geocoder.from("Stanely Park")
      .then(json => {
        let park = json.results[0].geometry.location;
        let parkName = json.results[0].address_components.long_name;
        setPark(park);
        setName(parkName);
        setState({isReady: true});
      })
      .catch(error => console.warn(error));
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const coords = [
    {
      latitude: lat, 
      longitude: lng,
    },
    {
      latitude: park.lat, 
      longitude: park.lng,
    },
  ];

  console.log(coords);
  console.log(state);

  if (!state.isReady) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="small" />
      </View>
    ); }
  return (
    <View style={styles.loading_container}>
      <MapView 
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialCamera={{
          center: {
            latitude: lat,
            longitude: lng,
          },
          pitch: 0,
          heading: 0,
          zoom: 15,
          altitude: 100
        }}
      >
        <MapView.Marker
              coordinate={coords[1]}
              title={parkName}
              description={"Somewhere with grass!"}
          />
          <MapViewDirections
            id="line"
            origin={coords[0]}
            destination={coords[1]}
            apikey={"AIzaSyABSrEMbXv69aQ5IczL3ZzBbnDBAGo-1bs"}
            strokeWidth={5}
            strokeColor="blue"
            resetOnChange={true}
          />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading_container: {
    flex: 1,
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});