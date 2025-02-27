import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserResetPW = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [userExists, setUserExists] = useState(false);

  const sendOtp = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        ToastAndroid.show('No account found with this email/number.', ToastAndroid.SHORT);
        return;
      }

      const user = JSON.parse(storedUser);
      if (identifier === user.email || identifier === user.mobileNumber) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        setGeneratedOtp(otpCode);
        setUserExists(true);
        ToastAndroid.show(`OTP sent: ${otpCode}`, ToastAndroid.SHORT); // Simulating sending OTP
      } else {
        ToastAndroid.show('No account found with this email/number.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      navigation.navigate('UserCreateNewPassword', { identifier });
    } else {
      ToastAndroid.show('Invalid OTP. Please try again.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={MyStyles.container}>
      <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 20 }}>
        Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
      </Text>
      <Image source={require('../../assets/plain.png')} style={MyStyles.logo} />

      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Reset Password</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>
        Enter your email or mobile number to receive a reset code.
      </Text>

      <View style={MyStyles.row}>
        <TextInput
          style={{
            width: 210,
            height: 45,
            borderWidth: 1,
            borderColor: '#8B0000',
            paddingLeft: 10,
            marginBottom: 10,
            backgroundColor: 'white',
            color:'#ac2e39',
            fontStyle: 'italic',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
          placeholder="Email/Mobile Number"
          placeholderTextColor={'#ac2e39'}
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
        />

        <TouchableOpacity style={MyStyles.sendButton} onPress={sendOtp}>
          <Text style={MyStyles.sendButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>

      {userExists && (
        <>
          <TextInput
            style={MyStyles.input}
            placeholder="OTP Code"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={MyStyles.Sbutton} onPress={verifyOtp}>
            <Text style={MyStyles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default UserResetPW;
