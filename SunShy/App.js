import * as React from 'react';
import { useState, useEffect } from "react";
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions, Alert, ActivityIndicator, TouchableOpacity, Text, } from 'react-native';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import DialogInput from "react-native-dialog-input";

Geocoder.init("AIzaSyABSrEMbXv69aQ5IczL3ZzBbnDBAGo-1bs");

export default function App () {
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [park, setPark] = useState({lat: 0, lng: 0});
  const [parkName, setName] = useState(" ")
  const [state, setState] = useState({isReady: false},);
  const [input, setInput] = useState("Simon Fraser University");
  const [visible, setVisible] = useState(false);

  const createThreeButtonAlert = () =>
    Alert.alert('Go Touch Grass!', 'You Have Been Home For Too Long! Go Visit The Outdoors!', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Busy Right Now',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);

  async function setHome() {
    let location = await Location.getCurrentPositionAsync({});
    setLat(location.coords.latitude);
    setLng(location.coords.longitude);
  };

  async function changePark() {
    setState({isReady: false});
    setPark({latitude: 0, longitude: 0});
    Geocoder.from(input)
        .then(json => {
        let park = json.results[0].geometry.location;
        let parkName = json.results[0].address_components.long_name;
        setPark(park);
        setName(parkName);
        if (visible) {
            setVisible(false);
        }
        setState({isReady: true});
        })
        .catch(error => console.warn(error));
  };

  const showDialog = () => {
    setVisible(true);
  };

  async function loadData() {
    setState({isReady: false});
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
      changePark();
  };

  async function submitDialog(inputText) {
    setInput(inputText);
    setPark({latitude: 0, longitude: 0});
    changePark();
    setVisible(false);
  }
  
  useEffect(() => {
    loadData();
  }, []);

  if (!state.isReady) {
    return (
      <View style={[styles.loading_container]}>
        <ActivityIndicator size="small" />
      </View>
    ); }
  return (
    <View style={styles.container}>
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
              coordinate={{latitude: park.lat, longitude: park.lng}}
              title={parkName}
              description={"Somewhere with grass!"}
          />
          <MapViewDirections
            origin={{latitude: lat, longitude: lng}}
            destination={{latitude: park.lat, longitude: park.lng}}
            apikey={"AIzaSyABSrEMbXv69aQ5IczL3ZzBbnDBAGo-1bs"}
            strokeWidth={5}
            strokeColor="blue"
          />
      </MapView>
      <View style={styles.button_container}>
        <TouchableOpacity style = {styles.button1} onPress={setHome}>
          <Text style={styles.text}>Set Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button2} onPress={createThreeButtonAlert}>
          <Text style={styles.text}>Test Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button3} onPress={showDialog}>
                  <Text style={styles.text}>Set Park</Text>
        </TouchableOpacity>
      </View>
      <View>
        <DialogInput isDialogVisible={visible}
                    title={"SunShy"}
                    message={"Please Enter A Destination:"}
                    hintInput ={"Try The Name Of A Nearby Park"}
                    submitInput={ (inputText) => {submitDialog(inputText)}}
                    closeDialog={ () => {setVisible(false)}}>
        </DialogInput>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E5E3C9',
  },
  loading_container: {
    flex: 1,
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get('window').width,
    height: '90%',
  },
  button_container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B4CFB0',
  },
  button1: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    marginRight: 10,
    marginLeft: 0,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#94B49F',
    borderRadius: 10,
    borderColor: 'white',
  },
  button2: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    marginRight: 0,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#94B49F',
    borderRadius: 10,
    borderColor: 'white',
  },
  button3: {
      position: 'absolute',
      bottom: 10,
      marginRight: 0,
      marginLeft: 10,
      marginTop: 10,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: '#94B49F',
      borderRadius: 10,
      borderColor: 'white',
    },
  text: {
    color:'#E5E3C9',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10
  },
});