import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MyStyles from './AllStyles/MyStyles';
import { Ionicons } from '@expo/vector-icons';

const Call = ({navigation}) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <View style={[MyStyles.container, { backgroundColor: 'white' }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/backButton.png')} style={[MyStyles.back, { marginRight: 260, marginBottom:50 }]} />
        </TouchableOpacity>

            <View style={[MyStyles.mbox, {marginBottom:50}]}>
                <Image source={require('../assets/defaultRtPFP.png')} style={MyStyles.rtPFP} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkred', marginTop: 10 }}>Rescue Team</Text>
                <Text style={{ fontSize: 16, color: 'gray', marginTop: 5 }}>{formatTime(seconds)}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
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

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'red', padding: 20, borderRadius: 50, marginTop: 30 }}>
                <Ionicons name="call" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default Call;