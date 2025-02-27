import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserResetPW = ({ navigation, route }) => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (route.params?.identifier) {
      setIdentifier(route.params.identifier);
    }
  }, [route.params?.identifier]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleIdentifierChange = (text) => {
    setIdentifier(text);
    setUserExists(false);
    setOtp('');
    setGeneratedOtp(null);
    setTimer(0);
    setErrorMessage('');
  };

  const handleOtpChange = (text) => {
    setOtp(text);
    setErrorMessage(''); 
  };

  const sendOtp = async () => {
    if (timer > 0) return;

    setErrorMessage('');

    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = users.find(user => user.email === identifier || user.mobileNumber === identifier);
      if (!foundUser) {
        setErrorMessage('No account found with this Email or Mobile Number.');
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);
      setUserExists(true);
      setTimer(30);

      Alert.alert("EmergencyGO", `Your One-Time-PIN is: ${otpCode}`, [{ text: "OK" }]);

    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };


////////////////////////////////////FOR OTP AND CONTINUE BUTTON VERIFICATION
  const verifyOtp = () => {
    if (!userExists) {
      setErrorMessage('Please request an OTP first');
      return;
    }
  
    if (!otp) {
      setErrorMessage('Enter the OTP sent to your email or mobile number');
      return;
    }
  
    if (otp === generatedOtp) {
      navigation.navigate('UserCreateNewPassword', { identifier });
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };
  

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, { alignSelf: 'flex-start', marginLeft: 25, marginBottom:5, marginTop:40, }]}>
        <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
          <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:25}]} />
        </TouchableOpacity>
        <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 15 }}>Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
        </Text>
      </View>
      
      <Image source={require('../../assets/plain.png')} style={MyStyles.logo} />

      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Reset Password</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>
        Enter your email or mobile number to receive a reset code.
      </Text>

      <View style={MyStyles.row}>
        <TextInput
          style={{
            width: 218,
            height: 45,
            borderWidth: 1,
            borderColor: '#8B0000',
            paddingLeft: 10,
            marginBottom: 10,
            backgroundColor: 'white',
            color: '#ac2e39',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
          placeholder="Email Address/Mobile Number"
          placeholderTextColor={'#ac2e39'}
          keyboardType="email-address"
          value={identifier}
          onChangeText={handleIdentifierChange}
        />

        <TouchableOpacity
          style={[MyStyles.sendButton, { backgroundColor: timer > 0 ? '#c68286' : '#8B0000' }]}
          onPress={sendOtp}
          disabled={timer > 0}
        >
          <Text style={MyStyles.sendButtonText}>{timer > 0 ? `Resend in ${timer}s` : 'Send Code'}</Text>
        </TouchableOpacity>
      </View>

      {userExists && (
        <>
          <TextInput
            style={MyStyles.input}
            placeholder="OTP Code"
            keyboardType="numeric"
            value={otp}
            onChangeText={handleOtpChange}
          />
        </>
      )}

      <View style={{ height: 20, justifyContent: 'center', alignSelf: 'flex-start', marginLeft: 29 }}>
        {errorMessage ? (
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
        ) : null}
      </View>

      <TouchableOpacity style={MyStyles.Sbutton} onPress={verifyOtp}>
        <Text style={MyStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserResetPW