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
  const [invalidEmailDomain, setInvalidEmailDomain] = useState(false);
  const validDomains = ['gmail.com','yahoo.com','hotmail.com','aol.com','hotmail.co.uk','hotmail.fr','msn.com','yahoo.fr','wanadoo.fr','orange.fr','comcast.net','yahoo.co.uk','yahoo.com.br','yahoo.co.in','outlook.com','live.com','rediffmail.com','free.fr','gmx.de','web.de','yandex.ru','ymail.com','libero.it','outlook.com','uol.com.br','bol.com.br','mail.ru','cox.net','hotmail.it','sbcglobal.net','sfr.fr','live.fr','verizon.net','live.co.uk','googlemail.com','yahoo.es','ig.com.br','live.nl','bigpond.com','terra.com.br','yahoo.it','neuf.fr','yahoo.de','alice.it','rocketmail.com','att.net','laposte.net','facebook.com','bellsouth.net','yahoo.in','hotmail.es','charter.net','yahoo.ca','yahoo.com.au','rambler.ru','hotmail.de','tiscali.it','shaw.ca','yahoo.co.jp','sky.com','earthlink.net','optonline.net','freenet.de','t-online.de','aliceadsl.fr','virgilio.it','home.nl','qq.com','telenet.be','me.com','yahoo.com.ar','tiscali.co.uk','yahoo.com.mx','voila.fr','gmx.net','mail.com','planet.nl','tin.it','live.it','ntlworld.com','arcor.de','yahoo.co.id','frontiernet.net','hetnet.nl','live.com.au','yahoo.com.sg','zonnet.nl','club-internet.fr','juno.com','optusnet.com.au','blueyonder.co.uk','bluewin.ch','skynet.be','sympatico.ca','windstream.net','mac.com','centurytel.net','chello.nl','live.ca','aim.com','bigpond.net.au', 'school.edu.ph', 'government.gov','school.edu','students.nu-moa.edu.ph','nu-moa.edu.ph'];

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Fetched User Data:", parsedUser);
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

////////////////FOR PASSWORD
  useEffect(() => {
    if (updatePassword && updateConfirmPassword && updatePassword !== updateConfirmPassword) {
      setUpdatedPasswordMismatch(true);
    } else {
      setUpdatedPasswordMismatch(false);
    }
  }, [updatePassword, updateConfirmPassword]);

/////////////////////////SEND OTP
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

//////////////////////////////////////////////////EDIT PROFILE VALIDATIONS
  useEffect(() => {
    if (updateEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const domain = updateEmail.split('@')[1]?.toLowerCase();

      if (!updateEmail.match(emailRegex) || !validDomains.includes(domain)) {
        setInvalidEmailDomain(true);
      } else {
        setEmailError('');
        setInvalidEmailDomain(false);
      }
    } else {
      setEmailError('');
      setInvalidEmailDomain(false);
    }
  }, [updateEmail]);

  useEffect(() => {
    const mobileRegex = /^\d{11}$/;

    if (!updateMobileNumber.match(mobileRegex)) {
      setMobileError('Invalid mobile number.');
    } else {
      setMobileError('');
    }
  }, [updateMobileNumber]);

  const handleEditProfile = async () => {
    if (!user || !user.userId) {
      console.error("Error: User ID is missing!");
      return;
    }
  
    if (!updateFirstName || !updateLastName || !updateEmail || !updateMobileNumber) {
      setOtpErrorMessage('Please fill in all required fields.');
      return;
    }
  
    const storedUsers = await AsyncStorage.getItem('users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    const userIndex = users.findIndex(u => u.userId === user.userId);
    if (userIndex === -1) {
      console.error("Error: User not found!");
      return;
    }

    const isEmailTaken = users.some(u => 
      u.email.toLowerCase() === updateEmail.toLowerCase() && u.userId !== user.userId
    );
  
    if (isEmailTaken) {
      setEmailError('This email is already in use.');
      return;
    } else {
      setEmailError('');
    }
  
    const isMobileTaken = users.some(u => u.mobileNumber === updateMobileNumber && u.userId !== user.userId);
    if (isMobileTaken) {
      setMobileError('This mobile number is already in use.');
      return;
    } else {
      setMobileError('');
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
      ...users[userIndex],
      firstName: updateFirstName,
      lastName: updateLastName,
      fullName: `${updateFirstName} ${updateLastName}`,
      address: updateAddress,
      dob: updateDob,
      email: updateEmail,
      mobileNumber: updateMobileNumber,
      password: updatePassword ? updatePassword : users[userIndex].password,
    };
  
    users[userIndex] = updatedUserData;
  
    try {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUserData));
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log("Updated User Data:", updatedUserData);
      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      navigation.navigate('UserTabs');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };  

  const handleSaveChanges = () => {
    if (!enteredOtp) {
      setOtpSaveErrorMessage('Verify your phone number before saving changes.');
      return;
    }
    if (enteredOtp !== otp) {
      setOtpErrorMessage('Invalid OTP entered.');
      return;
    }
    setOtpSaveErrorMessage('');
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
        onChangeText={(text) => {
        setUpdatedEmail(text.toLowerCase());
        }}
      />

      {emailError ? (
        <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{emailError}</Text>) : null
      }
      {invalidEmailDomain && 
        <Text style={{color: 'red', marginBottom: 10, marginRight: 10, marginRight:170}}>Invalid email address</Text>
      }

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
            <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, marginRight: 5 }}>{passwordLengthError}</Text>
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
          {updatedPasswordMismatch && (<Text style={{color: 'red', fontSize: 14, marginBottom: 5, marginRight: 165}}>Passwords do not match</Text>
          )}
        </>
      )}

      {passwordError ? (
        <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, marginRight: 75 }}>{passwordError}</Text>) : null
      }

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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        }}
        placeholder="Mobile Number"
        keyboardType="numeric"
        placeholderTextColor="#ac2e39"
        value={updateMobileNumber}
        onChangeText={(text) => {
        setUpdatedMobileNumber(text);
        setMobileError('');
        }}
      />
        <TouchableOpacity
          onPress={generateOtp}
          style={[MyStyles.sendButton, { backgroundColor: isResendDisabled ? '#c68286' : '#8B0000' }]}
          disabled={isResendDisabled}
        >
          <Text style={MyStyles.sendButtonText}>{isResendDisabled ? `Resend in ${resendTimer}s` : 'Send Code'}</Text>
        </TouchableOpacity>
      </View>

    {mobileError ? (<Text style={{ color: 'red', fontSize: 14, marginBottom: 5, marginRight: 160 }}>{mobileError}</Text>) : null
    }

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
        <Text style={{ color: 'red', fontSize: 14, marginBottom: 5, marginRight: 180 }}>
          {otpErrorMessage}
        </Text>
      ) : null}

      <TouchableOpacity onPress={handleSaveChanges} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      {otpSaveErrorMessage ? (
        <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, textAlign: 'center' }}>{otpSaveErrorMessage}</Text>) : null
      }
    </ScrollView>
  );
};

export default UserEditProfile