import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import WritePoemPage from './screens/WritePoem';
import LoginPage from './screens/Login';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Enterance from './screens/Entrance';
import SignupPage from './screens/Signup';
import DrawerPage from './screens/Drawer';
import { Poem } from './interfaces/Poem';
import { User, SubUser } from './interfaces/User';
import PoemDetailPage from './screens/PoemDetail';
import UserDetailPage from './screens/UserDetail';
import SettingsPage from './screens/Settings';
import ChangeLangPage from './screens/settings/ChangeLang';

const StackHome = createStackNavigator<HomeStackParamList>();

export type HomeStackParamList = {
    Home: undefined;
    WritePoem: undefined;
    PoemDetail: {poem: Poem} | undefined;
    UserDetail: {profileUser: SubUser} | undefined;
};

function HomeStack() {
    return (
        <StackHome.Navigator>
            <StackHome.Screen name="Home" component={HomePage} options={{ headerTitle: 'Poemify', headerStyle: { elevation: 1 } }} />
            <StackHome.Screen name="WritePoem" component={WritePoemPage} options={{ headerTitle: 'Write A Poem', headerStyle: { elevation: 1 } }} />
            <StackHome.Screen name="PoemDetail" component={PoemDetailPage} options={{ headerTitle: 'Poem', headerStyle: { elevation: 1 } }} />
            <StackHome.Screen name="UserDetail" component={UserDetailPage} options={{ headerTitle: 'Profile', headerStyle: { elevation: 1 } }} />
        </StackHome.Navigator>
    );
}

const StackProfile = createStackNavigator<ProfileStackParamList>();

export type ProfileStackParamList = {
    Profile: undefined;
    PoemDetail: {poem: Poem} | undefined;
    Settings: undefined;
    ChangeLang: undefined;
};


function ProfileStack() {
    return (
        <StackProfile.Navigator>
            <StackProfile.Screen name="Profile" component={ProfilePage} options={{ headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="PoemDetail" component={PoemDetailPage} options={{ headerTitle: 'Poem', headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="Settings" component={SettingsPage} options={{ headerTitle: 'Settings', headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="ChangeLang" component={ChangeLangPage} options={{ headerTitle: 'Change Languages', headerStyle: { elevation: 1 } }} />
        </StackProfile.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{ keyboardHidesTabBar: true }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={() => ({
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => {
                        return <IconButton icon="home" size={size} color={color} />;
                    },
                })}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={() => ({
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => {
                        return <IconButton icon="account" size={size} color={color} />;
                    },
                })}
            />
        </Tab.Navigator>
    );
}

const StackEnterance = createStackNavigator();

function EnteranceStack() {
    return (
        <StackEnterance.Navigator
            headerMode="none"
        >
            <StackEnterance.Screen name="Enterance" component={Enterance} />
            <StackEnterance.Screen name="Login" component={LoginPage} />
            <StackEnterance.Screen name="Signup" component={SignupPage} />
        </StackEnterance.Navigator>
    );
}


const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <DrawerPage nav={props.navigation}/>
            )}
        >
            <Drawer.Screen name="Enterance" component={EnteranceStack} />
            <Drawer.Screen name="Home" component={Tabs} />
        </Drawer.Navigator>
    );
}


export default function AppNav() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}
