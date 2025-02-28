import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserEditProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [updateFirstName, setUpdatedFirstName] = useState('');
  const [updateLastName, setUpdatedLastName] = useState('');
  const [updateAddress, setUpdatedAddress] = useState('');
  const [updateDob, setUpdatedDob] = useState('');
  const [updateEmail, setUpdatedEmail] = useState('');
  const [updateMobileNumber, setUpdatedMobileNumber] = useState('');
  const [updatePassword, setUpdatedPassword] = useState('');
  const [updateConfirmPassword, setUpdatedConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [updatedPasswordMismatch, setUpdatedPasswordMismatch] = useState(false);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLengthError, setPasswordLengthError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const [otp, setOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [otpSaveErrorMessage, setOtpSaveErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Fetched User Data:", parsedUser); // Debugging log
        if (!parsedUser.userId) {
          console.warn("User ID is missing!");
        }
        setUser(parsedUser);
        setUpdatedFirstName(parsedUser.firstName);
        setUpdatedLastName(parsedUser.lastName);
        setUpdatedAddress(parsedUser.address);
        setUpdatedDob(parsedUser.dob);
        setUpdatedEmail(parsedUser.email);
        setUpdatedMobileNumber(parsedUser.mobileNumber);
      }
    };
    fetchUser();
  }, []);  

  useEffect(() => {
    if (updatePassword && updateConfirmPassword && updatePassword !== updateConfirmPassword) {
      setUpdatedPasswordMismatch(true);
    } else {
      setUpdatedPasswordMismatch(false);
    }
  }, [updatePassword, updateConfirmPassword]);

  const generateOtp = () => {
    if (isResendDisabled) return;

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    Alert.alert('OTP Sent', `Your OTP is: ${generatedOtp}`, [{ text: 'OK' }]);
    setOtpErrorMessage(''); 
    setOtpSent(true);

    setIsResendDisabled(true);
    setResendTimer(30);

    const countdown = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const checkIfEmailExists = async (email) => {
    const existingUsers = [
      { email: 'existinguser@example.com', mobileNumber: '1234567890' },
    ];
    return existingUsers.some(user => user.email === email);
  };
  
  const checkIfMobileNumberExists = async (mobileNumber) => {
    const existingUsers = [
      { email: 'existinguser@example.com', mobileNumber: '1234567890' },
    ];
    return existingUsers.some(user => user.mobileNumber === mobileNumber);
  };
  

  const handleEditProfile = async () => {
    if (!user || !user.userId) {
      console.error("Error: User ID is missing!");
      return;
    }

    if (!updateFirstName || !updateLastName || !updateEmail || !updateMobileNumber) {
      setOtpErrorMessage('Please fill in all required fields.');
      return;
    }
  
    const isEmailTaken = await checkIfEmailExists(updateEmail);
    const isMobileTaken = await checkIfMobileNumberExists(updateMobileNumber);
  
    if (isEmailTaken) {
      setEmailError('This email is already in use.');
    } else {
      setEmailError('');
    }
  
    if (isMobileTaken) {
      setMobileError('This mobile number is already in use.');
    } else {
      setMobileError('');
    }
  
    if (isEmailTaken || isMobileTaken) {
      return;
    }
  
    if (updatePassword && updatePassword !== updateConfirmPassword) {
      setOtpErrorMessage('Passwords do not match.');
      return;
    }
  
    if (otp === null) {
      setOtpErrorMessage('Please press "Send Code" to receive the OTP.');
      return;
    }
  
    if (enteredOtp !== otp) {
      setOtpErrorMessage('Invalid OTP. Please try again.');
      return;
    }
  
    const updatedUserData = {
      userId: user.userId,
      firstName: updateFirstName,
      lastName: updateLastName,
      fullName: `${updateFirstName} ${updateLastName}`,
      address: updateAddress,
      dob: updateDob,
      gender: user.gender,
      email: updateEmail,
      mobileNumber: updateMobileNumber,
      password: updatePassword || user.password,
    };
  
    try {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUserData));
      console.log("Updated User Data:", updatedUserData);
      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      navigation.navigate('UserTabs');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleSaveChanges = () => {
    if (!enteredOtp) {
      setOtpSaveErrorMessage('Save changes by entering the OTP sent to your mobile number. Press the [Send Code] button now.');
      return;
    }
    handleEditProfile();
  };

  const handlePasswordValidation = () => {
    if (currentPassword !== user.password) {
      setPasswordError('Incorrect password. Please try again.');
    } else {
      setPasswordError('');
    }
  
    if (updatePassword && updatePassword.length < 8) {
      setPasswordLengthError('Password must be at least 8 characters long.');
    } else {
      setPasswordLengthError('');
    }
  };  

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <View style={[MyStyles.row, { alignSelf: 'flex-start', marginLeft: 25, marginBottom: 15, marginTop: 50 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, { marginRight: 10 }]} />
        </TouchableOpacity>
        <Image source={require('../../assets/plain.png')} style={MyStyles.logo2} />
        <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#8B0000', marginBottom: 10 }}>
          Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
        </Text>
      </View>

      <Text style={[MyStyles.title, { marginBottom: 10 }]}>Edit Profile</Text>

      <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />

      <View style={MyStyles.row}>
        <TextInput
          style={{ width: 149, height: 45, borderWidth: 1, borderColor: '#8B0000', paddingLeft: 10, marginRight: 5, marginBottom: 10, backgroundColor: 'white', color: '#ac2e39', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }}
          placeholder="First Name"
          placeholderTextColor="#ac2e39"
          value={updateFirstName}
          onChangeText={setUpdatedFirstName}
        />
        <TextInput
          style={{ width: 149, height: 45, borderWidth: 1, borderColor: '#8B0000', paddingLeft: 10, marginRight: 5, marginBottom: 10, backgroundColor: 'white', color: '#ac2e39', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }}
          placeholder="Last Name"
          placeholderTextColor="#ac2e39"
          value={updateLastName}
          onChangeText={setUpdatedLastName}
        />
      </View>

      <TextInput
        style={MyStyles.input}
        placeholder="Address (Optional)"
        placeholderTextColor="#ac2e39"
        value={updateAddress}
        onChangeText={setUpdatedAddress}
      />

      <TextInput
        style={[MyStyles.input, { backgroundColor: '#f0e1e1' }]}

        placeholder="Date of Birth"
        placeholderTextColor="#ac2e39"
        value={updateDob}
        editable={false}
      />

      <TextInput
        style={[MyStyles.input, { backgroundColor: '#f0e1e1' }]}

        placeholder="Gender"
        placeholderTextColor="#ac2e39"
        value={user.gender}
        editable={false}
      />

      <TextInput
        style={MyStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#ac2e39"
        value={updateEmail}
        onChangeText={setUpdatedEmail}
      />

      <TextInput
        style={MyStyles.input}
        placeholder="Enter current password to change"
        secureTextEntry
        placeholderTextColor="#ac2e39"
        value={currentPassword}
        onChangeText={(text) => {
          setCurrentPassword(text);
          setIsPasswordDisabled(text === '');
        }}
        onBlur={handlePasswordValidation}
      />

      {currentPassword !== '' && currentPassword === user.password && (
        <>
          <TextInput
            style={[MyStyles.input, { backgroundColor: isPasswordDisabled ? '#f0e1e1' : 'white' }]}
            placeholder="Create New Password"
            secureTextEntry
            placeholderTextColor="#ac2e39"
            value={updatePassword}
            onChangeText={(text) => {
              setUpdatedPassword(text);
              handlePasswordValidation();
              setIsPasswordDisabled(text === '');
            }}
            editable={!isPasswordDisabled}
          />
          {passwordLengthError && (
            <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, marginRight: 5 }}>
              {passwordLengthError}
            </Text>
          )}

          <TextInput
            style={[MyStyles.input, { backgroundColor: isPasswordDisabled ? '#f0e1e1' : 'white' }]}
            placeholder="Confirm New Password"
            secureTextEntry
            placeholderTextColor="#ac2e39"
            value={updateConfirmPassword}
            onChangeText={setUpdatedConfirmPassword}
            editable={!isPasswordDisabled}
          />
          {updatedPasswordMismatch && (
            <Text style={{ color: 'red', fontSize: 12, marginBottom: 10, marginRight: 165 }}>Passwords do not match</Text>
          )}
        </>
      )}

      {passwordError ? (
        <Text style={{ color: 'red', fontSize: 12, marginBottom: 10, marginRight: 100 }}>
          {passwordError}
        </Text>
      ) : null}

      <View style={MyStyles.row}>
        <TextInput
          style={{ width: 213, height: 45, borderWidth: 1, borderColor: '#8B0000', paddingLeft: 10, marginRight: 5, marginBottom: 10, backgroundColor: 'white', color: '#ac2e39', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }}
          placeholder="Mobile Number"
          keyboardType="numeric"
          placeholderTextColor="#ac2e39"
          value={updateMobileNumber}
          onChangeText={setUpdatedMobileNumber}
        />
        <TouchableOpacity
          onPress={generateOtp}
          style={[MyStyles.sendButton, { backgroundColor: isResendDisabled ? '#c68286' : '#8B0000' }]}
          disabled={isResendDisabled}
        >
          <Text style={MyStyles.sendButtonText}>
            {isResendDisabled ? `Resend in ${resendTimer}s` : 'Send Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {otpSent && (
        <TextInput
          style={MyStyles.input}
          placeholder="OTP Code"
          keyboardType="numeric"
          placeholderTextColor="#ac2e39"
          value={enteredOtp}
          onChangeText={setEnteredOtp}
        />
      )}

      {otpErrorMessage ? (
        <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>
          {otpErrorMessage}
        </Text>
      ) : null}

      <TouchableOpacity onPress={handleSaveChanges} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      {otpSaveErrorMessage ? (
        <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, textAlign: 'center' }}>
          {otpSaveErrorMessage}
        </Text>
      ) : null}
    </ScrollView>
  );
};

export default UserEditProfile;
