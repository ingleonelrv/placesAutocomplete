import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View,} from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import {apiKey} from './apiKey'


export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
      latitude:0,
      longitude:0,
      error:null,
      destination:"",
      predictions:[]
    }
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position=>{
      this.setState({
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        error:null
      })
    },error=>this.setState({error:error.message}),
    {enableHighAccuracy:true,timeout:5000,maximumAge:2000}
    )
  }
  async onTextChangeDestination(destination){
    this.setState({destination})
    const apiURL=`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
    // console.log(apiURL)
    try {
      const result = await fetch(apiURL)
      const json=await result.json()
      this.setState({
          predictions:json.predictions
        
        })
    } catch (error) {
      console.error(error)
    }
  }
  render() {
    const predictions=this.state.predictions.map(prediction=>(
      <Text style={styles.suggestions} key={prediction.id}>
        {prediction.description}
      </Text>
    ))
    return (
      <View style={styles.container}>
        <MapView
          style={styles.styleMap}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={this.state} />
        </MapView>
        <TextInput 
          style={styles.destinationInput}
          placeholder='Enter destination' 
          value={this.state.destination} 
          onChangeText={destination=>this.onTextChangeDestination(destination)} />
          {predictions}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  styleMap:{
    ...StyleSheet.absoluteFillObject
  },
  destinationInput:{
    height:40,
    borderWidth:.1,
    padding:5,
    marginTop:50,
    marginLeft:5,
    marginRight:5,
    backgroundColor:'white'
  },
  suggestions:{
    backgroundColor:'white',
    padding:5,
    marginLeft:5,
    marginRight:5,
    borderWidth:.5,
    fontSize:16
  },
});
