import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCreateNewPW = ({ navigation, route }) => {
  const { identifier } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (text) => {
    setNewPassword(text);
    
    if (text.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (!storedUsers) {
        ToastAndroid.show('User not found.', ToastAndroid.SHORT);
        return;
      }

      let users = JSON.parse(storedUsers);
      let userIndex = users.findIndex(user => user.email === identifier || user.mobileNumber === identifier);

      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        await AsyncStorage.setItem('users', JSON.stringify(users));

        ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT);
        navigation.navigate('UserLogin');
      } else {
        ToastAndroid.show('User not found.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, { alignSelf: 'flex-start', marginLeft: 25, marginBottom:5, marginTop:40 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('UserResetPassword')}>
          <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:25}]} />
        </TouchableOpacity>
        <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 15 }}>
          Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
        </Text>
      </View>

      <Image source={require('../../assets/plain.png')} style={MyStyles.logo} />

      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Create New Password</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>Create a strong password that is easy to remember.</Text>

      <TextInput
        style={MyStyles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={handlePasswordChange}
      />
      {passwordError ? <Text style={{ color: 'red', marginBottom: 10, marginRight: 50 }}>{passwordError}</Text> : null}

      <TextInput
        style={MyStyles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrorMessage(newPassword !== text ? "Passwords don't match." : '');
        }}
      />

      {errorMessage ? <Text style={{ color: 'red', marginBottom: 10, marginRight: 150 }}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={handlePasswordReset} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserCreateNewPW