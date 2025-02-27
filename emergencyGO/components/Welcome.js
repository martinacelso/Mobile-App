import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MyStyles } from './AllStyles/MyStyles';
import { LinearGradient } from 'expo-linear-gradient';


const Welcome = ({ navigation }) => {

  return (

      <LinearGradient colors={['#8B0000', '#FFFFFF']} style={MyStyles.container}>
      <Text style={{fontSize: 42, fontStyle: 'italic', color: 'white', marginTop: 100,}}>Emergency<Text style={{ fontWeight: 'bold', fontStyle:'normal', }}>Go</Text></Text>
      <Image source={require('../assets/plain.png')} style={MyStyles.logo} />
        <TouchableOpacity 
          style={[MyStyles.Gbutton, {marginTop: 100}]} 
          onPress={() => navigation.navigate('UserType')}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8B0000', textAlign:'center' }}>GET STARTED</Text>
        </TouchableOpacity>
    </LinearGradient>

  );
}

export default Welcome