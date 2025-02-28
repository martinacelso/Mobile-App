import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserLogin = ({ navigation }) => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!emailOrMobile || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
  
    const user = users.find(user => 
      user.email === emailOrMobile || user.mobileNumber === emailOrMobile
    );
  
    if (!user) {
      setErrorMessage('Account not found.');
      return;
    }
  
    if (user.password === password) {
      setErrorMessage('');
  
      console.log(`User ID: ${user.userId}`); // ✅ Logs the user ID correctly
  
      try {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
  
      ToastAndroid.show('Login Successful!', ToastAndroid.SHORT);
      navigation.navigate('UserTabs');
    } else {
      setErrorMessage('Incorrect password.');
    }
  };  

  return (
    <View style={MyStyles.container}>
      <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 20 }}>
        Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
      </Text>
      <Image source={require('../../assets/plain.png')} style={MyStyles.logo} />

      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Welcome!</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>Sign in to ensure your safety.</Text>

      <TextInput
        style={MyStyles.input}
        placeholder="Email Address/Mobile Number"
        keyboardType="email-address"
        placeholderTextColor="#ac2e39"
        value={emailOrMobile}
        onChangeText={(text) => {
          setEmailOrMobile(text);
          setErrorMessage('');
        }}
      />
      
      <TextInput
        style={MyStyles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#ac2e39"
        value={password}
        onChangeText={(text) => {
        setPassword(text);
        setErrorMessage('');
        }}
      />

      <View style={{ width: "85%", alignSelf: 'flex-end' }}>
      {errorMessage ? (
        <Text style={{ color: 'red', alignSelf: 'flex-start', marginLeft: '-8%', marginBottom: -18 }}>
          {errorMessage}
        </Text>
      ) : null}
        <TouchableOpacity onPress={() => navigation.navigate('UserResetPassword')}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#8B0000', marginBottom: 10, marginRight: 30, textAlign: 'right' }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogin} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 14, color: '#8B0000' }}>Don't have an account?{' '}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserSignUp')}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#8B0000' }}>Sign Up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserLogin