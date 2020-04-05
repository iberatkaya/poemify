import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import WritePoem from './screens/WritePoem';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const StackHome = createStackNavigator();

export type HomeStackParamList = {
    Home: undefined;
    WritePoem: undefined;
};

function HomeStack() {
    return (
        <StackHome.Navigator>
            <StackHome.Screen name="Home" component={HomePage} options={{ headerTitle: 'Poemify', headerStyle: { elevation: 1 } }} />
            <StackHome.Screen name="WritePoem" component={WritePoem} options={{ headerTitle: 'Write A Poem', headerStyle: { elevation: 1 } }} />
        </StackHome.Navigator>
    );
}

const StackProfile = createStackNavigator();

function ProfileStack() {
    return (
        <StackProfile.Navigator>
            <StackProfile.Screen name="Profile" component={ProfilePage} options={{ headerStyle: { elevation: 1 } }} />
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

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <View style={{height: '100%'}}>
                    <View style={{height: 150, backgroundColor: 'blue'}}></View>
                    <TouchableOpacity style={styles.itemRow}>
                        <IconButton icon="email" size={20} color="#777"/>
                        <Text style={styles.text}>Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logout}>
                        <IconButton icon="logout" size={20} color="#777"/>
                        <Text style={styles.text}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        >
            <Drawer.Screen name="Home" component={Tabs} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingLeft: 17, 
        paddingVertical: 12
    },
    text: {
        fontSize: 14, 
        fontWeight: 'bold', 
        paddingLeft: 12, 
        color: '#000'
    },
    logout: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingLeft: 17, 
        paddingVertical: 12,
        position: 'absolute', 
        bottom: 0
    }
})

export default function AppNav() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}
