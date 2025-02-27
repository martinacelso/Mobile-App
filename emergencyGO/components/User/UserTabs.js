import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ToastAndroid, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import MyStyles from '../AllStyles/MyStyles';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

///////////////////////////TO DISPLAY USER'S FIRST NAME IN THE GREETINGS HEADER
const fetchUserFirstName = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.firstName || 'User';
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  return 'User';
};


/////////////////////////////FOR HOME TAB
const Home = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    fetchUserFirstName().then(setFirstName);
  }, []);

  return (
    <View style={MyStyles.container}>
      <View style={MyStyles.header}>
        <View>
          <Text style={MyStyles.greeting}>Hello,</Text>
          <Text style={MyStyles.userName}>{firstName}</Text>
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
    fetchUserFirstName().then(setFirstName);
  }, []);

  return (
    <View style={MyStyles.container}>
      <View style={MyStyles.header}>
        <View>
          <Text style={MyStyles.greeting}>Hello,</Text>
          <Text style={MyStyles.userName}>{firstName}</Text>
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
const Contacts = ({ navigation }) => {
  const [contactPerson, setContactPerson] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        setContactPerson(JSON.parse(storedContacts));
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchContacts);
    return () => unsubscribe();
  }, [navigation]);

  const handleContactOptions = (contactId) => {
    if (selectedContactId === contactId) {
      setSelectedContactId(null);
    } else {
      setSelectedContactId(contactId);
    }
  };
  

  const handleEditContact = (contactId) => {
    const contact = contactPerson.find(c => c.id === contactId);
    if (contact) {
      navigation.navigate('UserAddContact', { contact });
    }
  };

  const handleDeleteContact = async (contactId) => {
    console.log("Delete clicked for contact ID: ", contactId);

    const updatedContacts = contactPerson.filter(contact => contact.id !== contactId);
    setContactPerson(updatedContacts);

    await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  return (
    <View style={MyStyles.container}>
      <Text style={[MyStyles.title, { marginTop: 50 }]}>Contacts</Text>

      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          {contactPerson.length === 0 ? (
            <Text style={{ color: '#8B0000', fontSize: 18, marginBottom: 20 }}>
              No contacts added yet.
            </Text>
          ) : (
            contactPerson.map((contact) => (
              <View key={contact.id} style={MyStyles.contactCard}>
                <View style={MyStyles.row}>
                  <Image source={contact.image} style={MyStyles.contactImage} />

                  <View style={MyStyles.contactInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={MyStyles.contactName}>{contact.name}</Text>
                      <TouchableOpacity onPress={() => handleContactOptions(contact.id)}>
                        <Image source={require('../../assets/option.png')} style={MyStyles.option} />
                      </TouchableOpacity>
                    </View>

                    <Text style={{ color: '#8B0000' }}>{contact.phone}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                      {selectedContactId === contact.id ? (
                        <>
                          <TouchableOpacity
                            onPress={() => handleEditContact(contact.id)}
                            style={[MyStyles.cmButton2, { backgroundColor: '#c68286' }]}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDeleteContact(contact.id)}
                            style={[MyStyles.cmButton2, { backgroundColor: '#8B0000' }]}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Delete</Text>
                          </TouchableOpacity>
                        </>
                      ) : (

                        <>
                          <TouchableOpacity
                            onPress={() => {/* Call Logic */}}
                            style={[MyStyles.cmButton2, { backgroundColor: '#8B0000' }]}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {/* Message Logic */}}
                            style={[MyStyles.cmButton2, { backgroundColor: '#c68286' }]}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Message</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
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
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    navigation.navigate('UserLogin');
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

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
          <Text style={MyStyles.profileInfo}>{user.firstName} {user.lastName}</Text>
          <Text style={MyStyles.profileInfo}>{user.gender}</Text>
          <Text style={MyStyles.profileInfo}>{user.dob}</Text>
          <Text style={MyStyles.profileInfo}>{user.address}</Text>
          <Text style={MyStyles.profileInfo}>{user.mobileNumber}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity onPress={handleLogout} style={MyStyles.Sbutton}>
        <Text style={MyStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};



/////////////////////////////FOR CALL


/////////////////////////////FOR MESSAGE


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