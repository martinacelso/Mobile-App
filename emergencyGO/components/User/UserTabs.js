import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import MyStyles from '../AllStyles/MyStyles';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

/////////////////////////////FOR HOME TAB
const Home = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const nameParts = user.fullName.split(' '); // Split full name into parts
        setFirstName(nameParts[0]); // Get first name
      }
    };
    fetchUserName();
  }, []);

  return (
    <View style={MyStyles.container}>
      <View style={MyStyles.header}>
        <View>
          <Text style={MyStyles.greeting}>Hello,</Text>
          <Text style={MyStyles.userName}>{firstName || 'User'}</Text>
        </View>
        <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.profileImage} />
      </View>

      <View style={{marginTop: 140, alignItems: 'center'}}>
        <Text style={[MyStyles.title, MyStyles.centerText]}>Are you in an emergency?</Text>
        <Text style={[MyStyles.subtitle, MyStyles.centeredText]}>Press the button below and help will reach you soon.</Text>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Activity')} 
          style={MyStyles.sosButton}
        >
          <Text style={{fontSize: 40, fontWeight: 'bold', color: 'white'}}>SOS</Text>
        </TouchableOpacity>

        <View style={MyStyles.locationContainer}>
          <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.locationIcon} />
          <View style={MyStyles.locationTextContainer}>
            <Text style={{color: '#8B0000', fontSize: 20, fontWeight: 'bold'}}>Your current location</Text>
            <Text style={{color: '#8B0000', fontSize: 15}}>Coral Way, Pasay City</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/////////////////////////////FOR ACTIVITTY TAB (LOCATION NG RESCUER)
const Activity = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const nameParts = user.fullName.split(' ');
        setFirstName(nameParts[0]);
      }
    };
    fetchUserName();
  }, []);

  return (
    <View style={MyStyles.container}>
      <View style={MyStyles.header}>
        <View>
          <Text style={MyStyles.greeting}>Hello,</Text>
          <Text style={MyStyles.userName}>{firstName || 'User'}</Text>
        </View>
        <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.profileImage} />
      </View>

      <View style={{marginTop: 130, alignItems: 'center', width: '100%'}}>
        <Text style={[MyStyles.title, MyStyles.centeredText]}>
          Help and rescue are on its way to you!
        </Text>
        <Text style={[MyStyles.subtitle, MyStyles.centeredText]}>
          Stay in a safe space and remain calm until help and rescue arrives.
        </Text>

        <View style={{width: '90%', height: 200, borderRadius: 10, overflow: 'hidden',}}>
          <MapView
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: 14.530714,
              longitude: 120.981003,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{latitude: 14.530714, longitude: 120.981003}} title="Your Location" />
          </MapView>
        </View>

        <View style={MyStyles.locationContainer}>
          <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.locationIcon} />
          <View style={{flex: 1}}>
            <Text style={{color: '#8B0000', fontSize: 20, fontWeight: 'bold'}}>Rescue Team</Text>
            <Text style={{color: '#8B0000', fontSize: 15}}>(5 min away)</Text>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Call')}
                style={[MyStyles.cmButton, { backgroundColor: '#8B0000'}]}
              >
                <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center'}}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Message')} 
                style={[MyStyles.cmButton, {backgroundColor: '#c68286', marginLeft: 10, marginRight:15}]}
              >
                <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center'}}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};


/////////////////////////////FOR CONTACTS TAB
const contactPerson = [
  { id: 1, name: 'Yvonne Brian', image: require('../../assets/defaultUserPFP.png') },
  { id: 2, name: 'Matthew Martin', image: require('../../assets/defaultUserPFP.png') },
  { id: 3, name: 'Miguel Bermejo', image: require('../../assets/defaultUserPFP.png') },
  { id: 4, name: 'Mark Alarcon', image: require('../../assets/defaultUserPFP.png') },
  { id: 5, name: 'Mykhail Mirano', image: require('../../assets/defaultUserPFP.png') },
  { id: 6, name: 'Kim Mingyu', image: require('../../assets/defaultUserPFP.png') },
];

const Contacts = ({ navigation }) => {
  return (
    <View style={MyStyles.container}>
      <Text style={[MyStyles.title, { marginTop: 50 }]}>Contacts</Text>

      <ScrollView style={{ width: '100%' }}>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          {contactPerson.map((contact) => (
            <View key={contact.id} style={MyStyles.contactCard}>

              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Image source={contact.image} style={MyStyles.contactImage} />

                <View style={MyStyles.contactInfo}>
                  <Text style={MyStyles.contactName}>{contact.name}</Text>

                  <View style={[MyStyles.buttonContainer, { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }]}>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Call')} 
                      style={[MyStyles.cmButton2, { backgroundColor: '#8B0000', flex: 1, marginRight: 5 }]}
                    > 
                      <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Call')} 
                      style={[MyStyles.cmButton2, { backgroundColor: '#c68286', flex: 1, marginLeft: 5 }]}
                    > 
                      <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('UserAddContact')} style={MyStyles.addButton}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>+ Add New</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


/////////////////////////////FOR PROFILE TAB
const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, {marginBottom:25, marginTop:15, marginLeft:70 }]}>
        <Text style={[MyStyles.title, { marginBottom: 10 }]}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserEditProfile')}>
          <Image source={require('../../assets/edit.png')} style={MyStyles.edit} />
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />

      {user ? (
        <>
          <Text style={MyStyles.profileInfo}>{user.fullName}</Text>
          <Text style={MyStyles.profileInfo}>{user.gender}</Text>
          <Text style={MyStyles.profileInfo}>{user.dob}</Text>
          <Text style={MyStyles.profileInfo}>{user.address}</Text>
          <Text style={MyStyles.profileInfo}>{user.mobileNumber}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};


/////////////////////////////FOR CALL


/////////////////////////////FOR MESSAGE


/////////////////////////////FOR ADD CONTACT
const UserAddContact = ({ navigation }) => {
  
    return (
      <View style={MyStyles.container}>
        <View style={[MyStyles.row, {marginBottom:25, marginTop:15, marginRight:80 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
            <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:60}]} />
          </TouchableOpacity>
          <Text style={[MyStyles.title, { marginBottom: 10 }]}>Add Contact</Text>
        </View>
        <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />
  
       
          <>
            <Text style={MyStyles.profileInfo}></Text>
            <Text style={MyStyles.profileInfo}></Text>
            <Text style={MyStyles.profileInfo}></Text>
            <Text style={MyStyles.profileInfo}></Text>
            <Text style={MyStyles.profileInfo}></Text>
          </>
  
        <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} style={MyStyles.Sbutton}>
          <Text style={MyStyles.buttonText}>Add to Contacts</Text>
        </TouchableOpacity>
      </View>
    );
  };

/////////////////////////////FOR USER EDIT PROFILE
const UserEditProfile = ({ navigation }) => {
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
      <View style={[MyStyles.row, {marginBottom:10, marginTop:60, marginRight:85 }]}>
          <TouchableOpacity onPress={() => navigation.navigate('UserTabs')}>
              <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:65}]} />
            </TouchableOpacity>
            <Text style={[MyStyles.title, { marginBottom: 10 }]}>Edit Profile</Text>
          </View>

          <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />

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
            <Text style={MyStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

    </ScrollView>
  );
};


/////////////////////////////FOR BOTTOM TAB
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Activity') iconName = 'map-marker-alt';
          else if (route.name === 'Contacts') iconName = 'phone';
          else if (route.name === 'Profile') iconName = 'user';
          return <FontAwesome5 name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#8B0000',
        tabBarInactiveTintColor: '#c68286',
        tabBarStyle: MyStyles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default UserTabs