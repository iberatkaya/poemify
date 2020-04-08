import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StackNavigationProp } from '@react-navigation/stack';
import {  EnteranceStackParamList } from '../AppNav';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from '../interfaces/User';

type IntroScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'Intro'>;

type Props = {
    navigation: IntroScreenNavigationProp;
};

const slides = [
    {
        key: 1,
        title: 'Welcome to\nPoemify!',
        image: require('../assets/icon.png'),
    },
    {
        key: 2,
        title: 'Sign Up',
        image: require('../assets/screenshots/1.jpg'),
    },
    {
        key: 3,
        title: 'Write Your Poem',
        image: require('../assets/screenshots/2.jpg'),
    },
    {
        key: 4,
        title: 'Like and View\nOther User\'s Poems',
        image: require('../assets/screenshots/3.jpg'),
    },
    {
        key: 4,
        title: 'Follow Other Users',
        image: require('../assets/screenshots/4.jpg'),
    },
    {
        key: 4,
        title: 'Bookmark Their\nPoems',
        image: require('../assets/screenshots/5.jpg'),
    }
];

function Intro(props: Props) {

    let _renderItem = ({ item }: any) => {
        return (
            <View style={styles.slide}>
                <Image resizeMode="contain" style={styles.image} source={item.image} />
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }
    //@ts-ignore
    return <AppIntroSlider renderItem={_renderItem} data={slides} onDone={async () => {
                props.navigation.navigate('Enterance');
                let user: User = { bookmarks: [], topics: [], id: '-1', email: '', username: '', poems: [], preferredLanguages: [], followers: [], following: [] };
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }} />;
}

export default Intro;

const styles = StyleSheet.create({
    slide: {
        height: '100%',
        paddingBottom: '20%',
        backgroundColor: '#b7c8dd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    image: {
        width: '55%',
        height: '80%'
    }
})