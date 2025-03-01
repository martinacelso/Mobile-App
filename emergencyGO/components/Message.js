import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import MyStyles from './AllStyles/MyStyles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const Message = ({ navigation, route }) => {
    const { name, photo } = route.params;
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const sendMessage = () => {
        if (text.trim().length > 0) {
            setMessages([...messages, { id: messages.length.toString(), text, sender: 'user' }]);
            setText('');
        }
    };
    return (
        <View style={MyStyles.container}>
            <View style={MyStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/backButton.png')} style={[MyStyles.back, {marginRight: 5, marginBottom: 10}]} />
                </TouchableOpacity>
                <Image source={photo} style={[MyStyles.profileImage, {marginRight: 15}]} />
                <Text style={[MyStyles.title, { marginRight: 15 }]}>{name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Call', { name, photo })}>
                    <FontAwesome name="phone" size={32} color="#ac2e39" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <View
                            style={[
                                MyStyles.mbox,
                                {
                                backgroundColor: item.sender === 'user' ? '#ffcccc' : '#ffe6e6',
                                padding: 10,
                                borderRadius: 15,
                                maxWidth: '70%', 
                                minWidth: item.text.length < 10 ? 50 : 'auto',
                                marginVertical: 5,
                                marginHorizontal: 4,
                                alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                                },
                            ]}
                        >
                            <Text style={{ color: '#ac2e39', textAlign: item.sender === 'user' ? 'right' : 'left' }}>
                                {item.text}
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingTop: 180, paddingHorizontal: 10 }}
            />


            <View style={[MyStyles.row, 
                {padding: 15, 
                backgroundColor: '#ffe6e6', 
                borderTopLeftRadius: 30, 
                borderTopRightRadius: 30, 
                height: 70,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                }]}>
                <TouchableOpacity>
                    <MaterialIcons name="location-on" size={24} color="#ac2e39" style={{marginRight: 5}} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="image" size={24} color="#ac2e39" style={{marginRight: 5}} />
                </TouchableOpacity>
                <TextInput
                    style={[MyStyles.input, {flex: 1}]}
                    placeholder="Send a message"
                    placeholderTextColor="#ac2e39"
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={MyStyles.sendButton} onPress={sendMessage}>
                    <Text style={MyStyles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Message