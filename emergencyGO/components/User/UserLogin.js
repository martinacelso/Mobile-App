import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please enter your email and password', ToastAndroid.SHORT);
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        ToastAndroid.show('No account found. Please sign up.', ToastAndroid.SHORT);
        return;
      }

      const user = JSON.parse(storedUser);
      if ((email === user.email || email === user.mobileNumber) && password === user.password) {
        ToastAndroid.show('Login Successful!', ToastAndroid.SHORT);
        navigation.navigate('UserTabs', { user });
      } else {
        ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error during login:', error);
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
        placeholder="Email/Mobile Number"
        keyboardType="email-address"
        placeholderTextColor="#ac2e39"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={MyStyles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#ac2e39"
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ width: "85%", alignSelf: 'flex-end' }}>
        <TouchableOpacity onPress={() => navigation.navigate('UserResetPassword')}>
          <Text style={{ fontSize: 14, color: '#8B0000', marginBottom: 10, marginRight: 30, textAlign: 'right' }}>
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

export default UserLogin;