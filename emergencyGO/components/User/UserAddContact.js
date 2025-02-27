import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyStyles } from '../AllStyles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserAddContact = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    if (route.params?.contact) {
      const { name, phone, id } = route.params.contact;
      setName(name);
      setPhone(phone);
      setContactId(id);
    }
  }, [route.params?.contact]);

  const handleSaveContact = async () => {
    if (!name || !phone) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      const contacts = storedContacts ? JSON.parse(storedContacts) : [];

      let updatedContacts;

      if (contactId) {
        updatedContacts = contacts.map(contact =>
          contact.id === contactId ? { ...contact, name, phone } : contact
        );
        ToastAndroid.show('Contact updated successfully!', ToastAndroid.SHORT);
      } else {

        const newContact = {
          id: Date.now().toString(),
          name,
          phone,
          image: require('../../assets/defaultUserPFP.png'),
        };
        updatedContacts = [...contacts, newContact];
        ToastAndroid.show('Contact added successfully!', ToastAndroid.SHORT);
      }

      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
      console.log(contactId ? 'Updated Contact:' : 'New Contact:', { name, phone });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDeleteContact = async () => {
    if (!contactId) {
      return;
    }

    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      const contacts = storedContacts ? JSON.parse(storedContacts) : [];

      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));

      ToastAndroid.show('Contact deleted successfully!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <View style={MyStyles.container}>
        <View style={[MyStyles.row, {alignSelf: 'flex-start', marginLeft: 25, marginBottom:15, marginTop:-80, marginBottom:30}]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('../../assets/backButton.png')} style={[MyStyles.back, {marginRight:10}]} />
            </TouchableOpacity>
            <Image source={require('../../assets/plain.png')} style={MyStyles.logo2} />
            <Text style={{ fontSize: 30, fontStyle: 'italic', color: '#8B0000', marginBottom: 10 }}>Emergency<Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Go</Text>
            </Text>
            </View>
        <Text style={[MyStyles.title, { marginBottom: 10 }]}>
            {contactId ? 'Edit Contact' : 'Add Contact'}
        </Text>

      <Image source={require('../../assets/defaultUserPFP.png')} style={MyStyles.userPFP} />

      <TextInput
        style={MyStyles.input}
        placeholder="Contact Name"
        placeholderTextColor="#ac2e39"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={MyStyles.input}
        placeholder="Phone Number"
        placeholderTextColor="#ac2e39"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity onPress={handleSaveContact} style={[MyStyles.Sbutton, { backgroundColor: '#c68286', marginBottom:0 }]}>
        <Text style={MyStyles.buttonText}>
          {contactId ? 'Update Contact' : 'Add to Contacts'}
        </Text>
      </TouchableOpacity>

      {contactId && (
        <TouchableOpacity onPress={handleDeleteContact} style={[MyStyles.Sbutton, { backgroundColor: '#8B0000' }]}>
          <Text style={MyStyles.buttonText}>Delete Contact</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserAddContact