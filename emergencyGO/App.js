import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './components/Welcome';
import UserType from './components/UserType';
import UserLogin from './components/User/UserLogin';
import UserSignUp from './components/User/UserSignUp';
import UserResetPW from './components/User/UserResetPW';
import UserCreateNewPW from './components/User/UserCreateNewPW';
import UserTabs from './components/User/UserTabs';
import UserAddContact from './components/User/UserAddContact';
import UserEditProfile from './components/User/UserEditProfile';
import Call from './components/Call';
import Message from './components/Message';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="UserType" component={UserType} />
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="UserSignUp" component={UserSignUp} />
        <Stack.Screen name="UserResetPassword" component={UserResetPW} />
        <Stack.Screen name="UserCreateNewPassword" component={UserCreateNewPW} />
        <Stack.Screen name="UserTabs" component={UserTabs} />
        <Stack.Screen name="UserAddContact" component={UserAddContact}/>
        <Stack.Screen name="UserEditProfile" component={UserEditProfile}/>
        <Stack.Screen name="Call" component={Call}/>
        <Stack.Screen name="Message" component={Message}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}