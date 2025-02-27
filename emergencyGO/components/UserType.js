import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MyStyles } from './AllStyles/MyStyles';

const UserType = ({ navigation }) => {
  return (
    <View style={MyStyles.container}>
      <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 20 }}>
        Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
      </Text>
      <Image source={require('../assets/plain.png')} style={MyStyles.logo} />
      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Welcome!</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>Ensure your safety or save lives today.</Text>

      <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>USER</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('Rescue Team Sign-In Coming Soon!')} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>RESCUE TEAM</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserType