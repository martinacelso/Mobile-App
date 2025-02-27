import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import { useState, useEffect } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserSignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
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

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !mobileNumber || !selectedGender || !dob || !address) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    const userData = {
      fullName: `${firstName} ${lastName}`,
      address,
      dob,
      gender: selectedGender,
      email,
      mobileNumber,
      password,
      confirmPassword,
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      ToastAndroid.show('Account Created Successfully!', ToastAndroid.SHORT);
      navigation.navigate('UserLogin');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

    return (

    <ScrollView contentContainerStyle={{ paddingBottom: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', }}>
      <View style={[MyStyles.row, { alignSelf: 'flex-start', marginLeft: 25, marginBottom:15, marginTop:40, }]}>
          <Image source={require('../../assets/plain.png')} style={MyStyles.logo2} />
          <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#8B0000', marginBottom: 10 }}>Emergency
            <Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
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
            onChangeText={setFirstName}
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
            onChangeText={setLastName}
          />
        </View>

        <TextInput style={MyStyles.input} 
          placeholder="Address" 
          placeholderTextColor="#ac2e39"
          value={address}
          onChangeText={setAddress} 
        />

        <TextInput style={MyStyles.input} 
          placeholder="Date of Birth" 
          placeholderTextColor="#ac2e39" 
          value={dob} 
          onChangeText={setDob}
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

        <TextInput style={MyStyles.input} 
          placeholder="Email" 
          keyboardType="email-address" 
          placeholderTextColor="#ac2e39"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput style={MyStyles.input} 
          placeholder="Create Password" 
          secureTextEntry 
          placeholderTextColor="#ac2e39"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput style={MyStyles.input} 
          placeholder="Confirm Password" 
          secureTextEntry 
          placeholderTextColor="#ac2e39"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

{passwordMismatch && (
        <Text style={{ color: 'red', marginBottom: 10 }}>Passwords do not match</Text>
      )}

        <View style={MyStyles.row}>
          <TextInput style={{ width: 210, 
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
            value={mobileNumber}
            onChangeText={setMobileNumber} 
          />
          <TouchableOpacity style={MyStyles.sendButton}>
              <Text style={MyStyles.sendButtonText}>Send Code</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={MyStyles.input} placeholder="OTP Code" keyboardType="numeric" placeholderTextColor="#ac2e39"/>
        <TouchableOpacity onPress={handleSignUp} style={MyStyles.Sbutton}>
            <Text style={MyStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

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