import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserSignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const genderOptions = [
    { id: '1', label: 'Male', value: 'Male' },
    { id: '2', label: 'Female', value: 'Female' },
    { id: '3', label: 'Other', value: 'Other' }
  ];
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [mobileExists, setMobileExists] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [invalidEmailDomain, setInvalidEmailDomain] = useState(false);
  const validDomains = ['gmail.com','yahoo.com','hotmail.com','aol.com','hotmail.co.uk','hotmail.fr','msn.com','yahoo.fr','wanadoo.fr','orange.fr','comcast.net','yahoo.co.uk','yahoo.com.br','yahoo.co.in','outlook.com','live.com','rediffmail.com','free.fr','gmx.de','web.de','yandex.ru','ymail.com','libero.it','outlook.com','uol.com.br','bol.com.br','mail.ru','cox.net','hotmail.it','sbcglobal.net','sfr.fr','live.fr','verizon.net','live.co.uk','googlemail.com','yahoo.es','ig.com.br','live.nl','bigpond.com','terra.com.br','yahoo.it','neuf.fr','yahoo.de','alice.it','rocketmail.com','att.net','laposte.net','facebook.com','bellsouth.net','yahoo.in','hotmail.es','charter.net','yahoo.ca','yahoo.com.au','rambler.ru','hotmail.de','tiscali.it','shaw.ca','yahoo.co.jp','sky.com','earthlink.net','optonline.net','freenet.de','t-online.de','aliceadsl.fr','virgilio.it','home.nl','qq.com','telenet.be','me.com','yahoo.com.ar','tiscali.co.uk','yahoo.com.mx','voila.fr','gmx.net','mail.com','planet.nl','tin.it','live.it','ntlworld.com','arcor.de','yahoo.co.id','frontiernet.net','hetnet.nl','live.com.au','yahoo.com.sg','zonnet.nl','club-internet.fr','juno.com','optusnet.com.au','blueyonder.co.uk','bluewin.ch','skynet.be','sympatico.ca','windstream.net','mac.com','centurytel.net','chello.nl','live.ca','aim.com','bigpond.net.au', 'school.edu.ph', 'government.gov','school.edu','students.nu-moa.edu.ph','nu-moa.edu.ph'];

  useEffect(() => {
    if (email) {
      const domain = email.split('@')[1];
      setInvalidEmailDomain(domain ? !validDomains.includes(domain) : true);
    } else {
      setInvalidEmailDomain(false);
    }
  }, [email]);


//////////////////////////////VALIDATION FOR PASSWORD MISMATCH, EXISTING EMAIL, AND EXISTING MOBILE NUMBER
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const checkEmailExists = async () => {
      if (email) {
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const exists = users.some(user => user.email === email);
        setEmailExists(exists);
      }
    };
    checkEmailExists();
  }, [email]);
  
  useEffect(() => {
    const checkMobileExists = async () => {
      if (mobileNumber) {
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const exists = users.some(user => user.mobileNumber === mobileNumber);
        setMobileExists(exists);
      }
    };
    checkMobileExists();
  }, [mobileNumber]);


//////////////////////////////FOR SENDING OTP TO MOBILE NUMBER AND OTP VALIDATION
const handleSendCode = async () => {
  if (!mobileNumber) {
    ToastAndroid.show('Enter your mobile number first', ToastAndroid.SHORT);
    return;
  }

  const storedUsers = await AsyncStorage.getItem('users');
  const users = storedUsers ? JSON.parse(storedUsers) : [];
  const exists = users.some(user => user.mobileNumber === mobileNumber);

  if (exists) {
    ToastAndroid.show('Mobile number is already in use', ToastAndroid.SHORT);
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setGeneratedOTP(otp);
  setShowOTPField(true);
  await AsyncStorage.setItem(`otp_${mobileNumber}`, otp);


  Alert.alert("EmergencyGO", `Your One-Time-PIN is: ${otp}`, [{ text: "OK" }]);

  setIsButtonDisabled(true);
  setTimer(30);
  const countdown = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(countdown);
        setIsButtonDisabled(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};


//////////////////////////////////////////FOR SIGN UP VALIDATIONS
const handleSignUp = async () => {
  setErrorMessage('');

  if (!generatedOTP) {
    setErrorMessage('Please press "Send Code" to receive the OTP before signing up.');
    return;
  }

  if (!enteredOTP) {
    setErrorMessage('Please enter the OTP sent to your mobile.');
    return;
  }

  if (!firstName || !lastName || !email || !password || !confirmPassword || !mobileNumber || !selectedGender || !dob || !address) {
    setErrorMessage('Please fill in all fields.');
    return;
  }

  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long.');
    return;
  }

  if (password !== confirmPassword) {
    setErrorMessage('Passwords do not match.');
    return;
  }

  if (emailExists) {
    setErrorMessage('Email is already in use. Please use another email.');
    return;
  }

  if (mobileExists) {
    setErrorMessage('Mobile number is already in use. Please use another number.');
    return;
  }

  const storedOTP = await AsyncStorage.getItem(`otp_${mobileNumber}`);
  if (enteredOTP !== storedOTP) {
    setOtpError('Invalid OTP. Please try again.');
    return;
  } else {
    setOtpError('');
  }

  // Generate unique user ID
  const userId = `USER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create new user object
  const newUser = { 
    userId, // Assign generated user ID
    firstName, 
    lastName, 
    address, 
    dob, 
    gender: selectedGender, 
    email, 
    mobileNumber, 
    password, 
    contactsHistory: [] // Initialize empty contacts history
  };

  // Retrieve existing users
  const storedUsers = await AsyncStorage.getItem('users');
  const users = storedUsers ? JSON.parse(storedUsers) : [];

  // Add new user and save to storage
  users.push(newUser);
  await AsyncStorage.setItem('users', JSON.stringify(users));
  await AsyncStorage.setItem('loggedInUser', JSON.stringify(newUser));

  ToastAndroid.show('Account Created Successfully!', ToastAndroid.SHORT);
  navigation.navigate('UserLogin');

  await AsyncStorage.removeItem(`otp_${mobileNumber}`);
};

  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', }}>
      <View style={[MyStyles.row, { alignSelf: 'flex-start', marginLeft: 25, marginBottom:15, marginTop:40, }]}>
        <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
          <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:10}]} />
        </TouchableOpacity>
        <Image source={require('../../assets/plain.png')} style={MyStyles.logo2} />
        <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#8B0000', marginBottom: 10 }}>Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
        </Text>
      </View>

        <Text style={[MyStyles.title, MyStyles.leftTextAlign]}>Let's Get Started!</Text>
        <Text style={[MyStyles.subtitle, MyStyles.leftTextAlign]}>Create an account, ensure your safety.</Text>
        <View style={MyStyles.row}>
          <TextInput  style={{ width: 149, 
            height: 45, 
            borderWidth: 1, 
            borderColor: '#8B0000', 
            paddingLeft: 10,
            marginRight:5, 
            marginBottom: 10, 
            backgroundColor: 'white',
            color: '#ac2e39',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            }} 
            placeholder="First Name" 
            placeholderTextColor="#ac2e39"
            value={firstName}
            onChangeText={(text) => {
              const formattedFN = text.replace(/\b\w/g, (char) => char.toUpperCase());
              setFirstName(formattedFN);
              setErrorMessage('');
            }}
          />
          <TextInput style={{width: 149, 
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
            placeholder="Last Name"
            placeholderTextColor="#ac2e39"
            value={lastName}
            onChangeText={(text) => {
              const formattedLN = text.replace(/\b\w/g, (char) => char.toUpperCase());
              setLastName(formattedLN);
              setErrorMessage('');
            }}
          />
        </View>

        <TextInput style={MyStyles.input} 
          placeholder="Address" 
          placeholderTextColor="#ac2e39"
          value={address}
          onChangeText={(text) => {
          setAddress(text);
          setErrorMessage('');
          }}
        />

        <TextInput
          style={MyStyles.input}
          placeholder="Birthdate (MM/DD/YYYY)"
          placeholderTextColor="#ac2e39"
          keyboardType="numeric"
          maxLength={10}
          value={dob}
          onChangeText={(text) => {
            let rawDate = text.replace(/[^0-9]/g, '');

            let formattedDate = rawDate;
            if (rawDate.length > 2) {
              formattedDate = `${rawDate.slice(0, 2)}/${rawDate.slice(2)}`;
            }
            if (rawDate.length > 5) {
              formattedDate = `${formattedDate.slice(0, 5)}/${formattedDate.slice(5)}`;
            }

            const parts = formattedDate.split('/');
            const month = parts[0] || ''; 
            const day = parts[1] || '';
            const year = parts[2] || '';

            if (formattedDate === '00/00/0000') {
              return;
            }

            if (month.length === 2 && (month < '01' || month > '12')) {
              return;
            }
            if (day.length === 2 && (day < '01' || day > '31')) {
              return;
            }
            if (year.length === 4 && (year < '0001' || year > '9999')) {
              return;
            }

            setDob(formattedDate);
            setErrorMessage('');
          }}
        />

        <Text style={[MyStyles.leftTextAlign, { color: '#ac2e39', marginBottom: 5 }]}>Gender</Text>
        <View style={{borderWidth: 1, borderColor: '#8B0000', padding: 5, marginBottom: 10, height: 45, width: 305, backgroundColor: 'white'}}>
          <RadioGroup
            radioButtons={genderOptions.map(option => ({
              ...option,
              labelStyle: { color: '#ac2e39' },
              color: '#ac2e39',
            }))}
            onPress={(id) => {
              const selectedOption = genderOptions.find(option => option.id === id);
              setSelectedGender(selectedOption ? selectedOption.value : null);
            }}
            selectedId={selectedGender ? genderOptions.find(option => option.value === selectedGender)?.id : null}
            layout="row"
          />
        </View>

        <TextInput
          style={MyStyles.input} 
          placeholder="Email Address" 
          keyboardType="email-address" 
          placeholderTextColor="#ac2e39"
          value={email}
          onChangeText={(text) => {
          setEmail(text.toLowerCase());
          setErrorMessage('');
          setEmailExists(false);
          setInvalidEmailDomain(false);
          }}
        />

      {emailExists && 
        <Text style={{color: 'red', marginBottom: 10, marginRight: 10, marginRight:165}}>Email is already in use</Text>
      }
      {invalidEmailDomain && 
        <Text style={{color: 'red', marginBottom: 10, marginRight: 10, marginRight:170}}>Invalid email address</Text>
      }

        <View style={MyStyles.row}>
          <TextInput style={{ width: 218, 
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
            placeholder="Mobile Number (09123456789)" 
            keyboardType="numeric"
            placeholderTextColor="#ac2e39"
            value={mobileNumber}
            onChangeText={(text) => {
            setMobileNumber(text);
            setErrorMessage('');
            setMobileExists(false);
            setShowOTPField(false);
            setGeneratedOTP('');
            setEnteredOTP('');
            setIsButtonDisabled(false);
            setTimer(0);
            }}
          />
          <TouchableOpacity 
            onPress={handleSendCode} 
            style={[MyStyles.sendButton, isButtonDisabled && { backgroundColor: '#c68286' }]}
            disabled={isButtonDisabled}
          >
            <Text style={MyStyles.sendButtonText}>{timer > 0 ? `Resend in ${timer}s` : 'Send Code'}</Text>
          </TouchableOpacity>
        </View>
        {mobileNumber.length > 0 && (mobileExists || mobileNumber.length !== 11) && (
          <Text style={{color: 'red', marginBottom: 10, marginRight: 100,width: 205,textAlign: 'left',}}>
            {mobileExists
              ? "Mobile Number is already in use"
              : "Invalid Mobile Number"
            }
          </Text>
        )}

        {showOTPField && mobileNumber.length === 11 && !mobileExists && (
          <>
            <TextInput 
              style={MyStyles.input} 
              placeholder="Code"
              placeholderTextColor="#ac2e39" 
              keyboardType="numeric"
              value={enteredOTP}
              onChangeText={(text) => {
              setEnteredOTP(text);
              setOtpError('');
              setErrorMessage('');
              }}
            />
            {otpError !== '' && (
              <Text style={{color: 'red', marginBottom: 10, alignSelf: 'flex-start', marginLeft: 30,}}>{otpError}</Text>
            )}
          </>
        )}

        <TextInput 
          style={MyStyles.input} 
          placeholder="Create Password" 
          secureTextEntry 
          placeholderTextColor="#ac2e39"
          value={password}
          onChangeText={(text) => {
          setPassword(text);
          setErrorMessage('');
          }}
        />
        {password.length > 0 && password.length < 8 && (
          <Text style={{color: 'red', marginBottom: 10, marginRight: 30}}>Password must be at least 8 characters long</Text>
        )}

        <TextInput style={MyStyles.input} 
          placeholder="Confirm Password" 
          secureTextEntry 
          placeholderTextColor="#ac2e39"
          value={confirmPassword}
          onChangeText={(text) => {
          setConfirmPassword(text);
          setErrorMessage('');
          }}
        />
      {passwordMismatch && (
        <Text style={{color: 'red', marginBottom: 10, marginRight:150}}>Passwords do not match</Text>
      )}

        <TouchableOpacity onPress={handleSignUp} style={MyStyles.Sbutton}>
            <Text style={MyStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {errorMessage !== '' && (
          <Text style={{color: 'red', marginBottom: 10, textAlign: 'center', width: 300}}>{errorMessage}</Text>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom:20, }}>
          <Text style={{ fontSize: 14, color: '#8B0000' }}>Already have an account?{' '}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#8B0000' }}>Login now</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

export default UserSignUp