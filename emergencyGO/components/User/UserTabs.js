import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ToastAndroid, Alert, StyleSheet } from 'react-native';
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
      console.log(`Logged in user: ${user.userId}`);
      return user.firstName || 'User';
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  return 'User';
};

const fetchUserData = async () => {
  const storedUser = await AsyncStorage.getItem('loggedInUser');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
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
          <Image source={require('../../assets/defaultRtPFP.png')} style={MyStyles.locationIcon} />
          <View style={{flex: 1}}>
            <Text style={{color: '#8B0000', fontSize: 20, fontWeight: 'bold'}}>Rescue Team</Text>
            <Text style={{color: '#8B0000', fontSize: 15}}>(5 min away)</Text>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Call', { 
                  name: "Rescue Team", 
                  photo: require('../../assets/defaultRtPFP.png') 
                })}
                style={[MyStyles.cmButton, { backgroundColor: '#8B0000'}]}
              >
                <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center'}}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Message', { 
                  name: "Rescue Team", 
                  photo: require('../../assets/defaultRtPFP.png') 
                })} 
                style={[MyStyles.cmButton, { backgroundColor: '#c68286', marginLeft: 10, marginRight: 15 }]}
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
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        if (!user.userId) return;
        console.log("Parsed User Data:", user.userId);

        const userContactsKey = `${user.userId}_contacts`;
        const storedContacts = await AsyncStorage.getItem(userContactsKey);
        setContactPerson(storedContacts ? JSON.parse(storedContacts) : []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchContacts);
    return unsubscribe;
  }, [navigation]);

  const handleEditContact = (contactId) => {
    const contact = contactPerson.find(c => c.id === contactId);
    if (contact) {
      navigation.navigate('UserAddContact', { contact });
    }
  };

  const handleDeleteContact = async (contactId) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        {text: "Cancel", style: "cancel"},
        {text: "Delete", onPress: async () => {
            try {
              const storedUser = await AsyncStorage.getItem('loggedInUser');
              if (!storedUser) return;
  
              const user = JSON.parse(storedUser);
              const userContactsKey = `${user.userId}_contacts`;
  
              const storedContacts = await AsyncStorage.getItem(userContactsKey);
              const contactList = storedContacts ? JSON.parse(storedContacts) : [];
  
              const updatedContacts = contactList.filter(contact => contact.id !== contactId);

              await AsyncStorage.setItem(userContactsKey, JSON.stringify(updatedContacts));
              setContactPerson([...updatedContacts]);

              ToastAndroid.show("Contact deleted successfully!", ToastAndroid.SHORT);
            } catch (error) {
              console.error("Error deleting contact:", error);
            }
          },
        },
      ]
    );
  };


  return (
    <View style={MyStyles.container}>
      <Text style={[MyStyles.title, { marginTop: 50 }]}>Contacts</Text>

      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          {contactPerson.length === 0 ? (
            <Text style={{ color: '#8B0000', fontSize: 18, marginBottom: 20 }}>No contacts added yet.</Text>
          ) : (
            contactPerson.map((contact) => (
              <View key={contact.id} style={MyStyles.contactCard}>
                <View style={MyStyles.row}>
                  <Image source={contact.image} style={MyStyles.contactImage} />

                  <View style={MyStyles.contactInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={MyStyles.contactName}>{contact.name}</Text>
                      <TouchableOpacity onPress={() => setSelectedContactId(selectedContactId === contact.id ? null : contact.id)}>
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
                            onPress={() => navigation.navigate('Call', { 
                              name: contact.name, 
                              photo: contact.image 
                            })}
                            style={[MyStyles.cmButton2, { backgroundColor: '#8B0000' }]}
                          >
                            <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => navigation.navigate('Message', { 
                                name: contact.name, 
                                photo: contact.image,
                                phone: contact.phone
                            })}
                            style={[MyStyles.cmButton2, { backgroundColor: '#c68286' }]}
                          >
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
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('User ID:', parsedUser.userId);
          console.log('User Data:', parsedUser);

          if (!parsedUser.userId) {
            console.error("User ID is missing in stored data.");
          }

          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchUser);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      console.log('User logged out');
      ToastAndroid.show('You have logged out of your account.', ToastAndroid.SHORT);
      navigation.replace('UserLogin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, { marginBottom: 25, marginTop: 15, marginLeft: 70 }]}>
        <Text style={[MyStyles.title, { marginBottom: 10 }]}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserEditProfile')}>
          <Image source={require('../../assets/edit.png')} style={MyStyles.edit} />
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />

      <Text style={MyStyles.profileInfo}>{user.firstName} {user.lastName}</Text>
      <Text style={MyStyles.profileInfo}>{user.gender}</Text>
      <Text style={MyStyles.profileInfo}>{user.dob}</Text>
      <Text style={MyStyles.profileInfo}>{user.address}</Text>
      <Text style={MyStyles.profileInfo}>{user.mobileNumber}</Text>

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