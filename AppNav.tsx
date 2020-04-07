import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from './redux/actions/User';
import { RootState } from './redux/store';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import WritePoemPage from './screens/WritePoem';
import LoginPage from './screens/Login';
import Enterance from './screens/Entrance';
import SignupPage from './screens/Signup';
import DrawerPage from './screens/Drawer';
import { Poem } from './interfaces/Poem';
import { User, SubUser } from './interfaces/User';
import PoemDetailPage from './screens/PoemDetail';
import UserDetailPage from './screens/UserDetail';
import SettingsPage from './screens/Settings';
import ChangeLangPage from './screens/settings/ChangeLang';
import ResetPasswordPage from './screens/ResetPassword';
import FollowListPage from './screens/FollowList';
import AsyncStorage from '@react-native-community/async-storage';

const StackHome = createStackNavigator<HomeStackParamList>();

export type HomeStackParamList = {
    Home: undefined;
    WritePoem: undefined;
    PoemDetail: { poem: Poem } | undefined;
    UserDetail: { profileUser: SubUser } | undefined;
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
    PoemDetail: { poem: Poem } | undefined;
    Settings: undefined;
    ChangeLang: undefined;
    FollowList: {type: 'follower' | 'following'};
    UserDetail: { profileUser: SubUser } | undefined;
};


function ProfileStack() {
    return (
        <StackProfile.Navigator>
            <StackProfile.Screen name="Profile" component={ProfilePage} options={{ headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="PoemDetail" component={PoemDetailPage} options={{ headerTitle: 'Poem', headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="Settings" component={SettingsPage} options={{ headerTitle: 'Settings', headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="ChangeLang" component={ChangeLangPage} options={{ headerTitle: 'Change Languages', headerStyle: { elevation: 1 } }} />
            <StackProfile.Screen name="FollowList" component={FollowListPage} options={{ headerTitle: 'Followers', headerStyle: { elevation: 1 } }} />
            <StackHome.Screen name="UserDetail" component={UserDetailPage} options={{ headerTitle: 'Profile', headerStyle: { elevation: 1 } }} />
        </StackProfile.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{ 
                keyboardHidesTabBar: true, 
                activeBackgroundColor: '#ececec',
                inactiveBackgroundColor: '#f9f9f9',
                activeTintColor: '#333',
                inactiveTintColor: '#888'
                
            }}
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

export type EnteranceStackParamList = {
    Enterance: undefined;
    Login: undefined;
    Signup: undefined;
    ResetPassword: undefined;
};

function EnteranceStack() {
    return (
        <StackEnterance.Navigator
            headerMode="none"
        >
            <StackEnterance.Screen name="Enterance" component={Enterance} />
            <StackEnterance.Screen name="Login" component={LoginPage} />
            <StackEnterance.Screen name="Signup" component={SignupPage} />
            <StackEnterance.Screen name="ResetPassword" component={ResetPasswordPage} />
        </StackEnterance.Navigator>
    );
}


const Drawer = createDrawerNavigator();

export type DrawerParamList = {
    EnteranceStack: undefined;
    Tabs: undefined;
}

const mapState = (state: RootState) => ({
    user: state.user
});

const mapDispatch = {
    setUser
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
};

let ConnectedDrawer = connector(function MyDrawer(props: Props) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let func = async () => {
            let getuser = await AsyncStorage.getItem('user');
            let usr = (getuser !== null) ? JSON.parse(getuser) : null;
            if (usr !== null && usr.username !== '') {
                props.setUser(usr);
                setUser(usr);
            }
        }
        func();
    }, [])

    useEffect(() => {
        let logout = async () => {
            let usr = props.user;
            if (usr.username === '') {
                setUser(null);
            }
            else{
                setUser(usr);
            }
        }
        logout();
    }, [props.user]);

    return (
        <Drawer.Navigator
            screenOptions={user !== null ? { gestureEnabled: true } : { gestureEnabled: false }}
            drawerContent={(prps) => (
                <DrawerPage nav={prps.navigation} />
            )}
        >
            {
                user === null ?
                    <Drawer.Screen name="EnteranceStack" component={EnteranceStack} />
                    :
                    <Drawer.Screen name="Tabs" component={Tabs} />
            }
        </Drawer.Navigator>
    );
});

export default function AppNav() {
    return (
        <NavigationContainer>
            <ConnectedDrawer />
        </NavigationContainer>
    );
}
