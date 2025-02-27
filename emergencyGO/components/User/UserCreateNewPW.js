import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCreateNewPW = ({ navigation, route }) => {
  const { identifier } = route.params; // Retrieve email/phone from previous screen
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        ToastAndroid.show('User not found.', ToastAndroid.SHORT);
        return;
      }

      let user = JSON.parse(storedUser);
      if (identifier === user.email || identifier === user.mobileNumber) {
        user.password = newPassword; // Update password
        await AsyncStorage.setItem('user', JSON.stringify(user)); // Save updated user data
        ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT);
        navigation.navigate('UserLogin'); // Redirect to login
      } else {
        ToastAndroid.show('User not found.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <View style={MyStyles.container}>
      <Text style={{ fontSize: 36, fontStyle: 'italic', color: '#8B0000', marginBottom: 20 }}>
        Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
      </Text>
      <Image source={require('../../assets/plain.png')} style={MyStyles.logo} />

      <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Create New Password</Text>
      <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>Create a strong password that is easy to remember.</Text>

      <TextInput
        style={MyStyles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={MyStyles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (newPassword !== text) {
            setErrorMessage("Passwords don't match.");
          } else {
            setErrorMessage('');
          }
        }}
      />

      {/* Error message display */}
      {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={handlePasswordReset} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserCreateNewPW;
