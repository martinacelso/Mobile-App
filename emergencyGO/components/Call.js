import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MyStyles from './AllStyles/MyStyles';
import { Ionicons } from '@expo/vector-icons';

const Call = ({ navigation }) => {
    return (
        <View style={[MyStyles.container, { backgroundColor: 'white' }]}> 
            {/* Back Button */}
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="darkred" />
            </TouchableOpacity>

            {/* Contact Info */}
            <View style={MyStyles.mbox}>
                <Image source={require('../assets/defaultRtPFP.png')} style={{ width: 120, height: 120 }} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkred', marginTop: 10 }}>Rescue Team</Text>
                <Text style={{ fontSize: 16, color: 'gray', marginTop: 5 }}>00:01</Text>
            </View>
            
            {/* Call Controls */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                <TouchableOpacity style={{ backgroundColor: 'lightblue', padding: 15, borderRadius: 50, margin: 10 }}>
                    <Ionicons name="volume-high" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'lightcoral', padding: 15, borderRadius: 50, margin: 10 }}>
                    <Ionicons name="videocam" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'lightcoral', padding: 15, borderRadius: 50, margin: 10 }}>
                    <Ionicons name="stop-circle" size={30} color="black" />
                </TouchableOpacity>
            </View>
            
            {/* End Call Button */}
            <TouchableOpacity style={{ backgroundColor: 'red', padding: 20, borderRadius: 50, marginTop: 30 }}>
                <Ionicons name="call" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default Call;
