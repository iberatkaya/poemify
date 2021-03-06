import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StackNavigationProp } from '@react-navigation/stack';
import { EnteranceStackParamList } from '../AppNav';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from '../interfaces/User';

type IntroScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'Intro'>;

type Props = {
    navigation: IntroScreenNavigationProp;
};

const slides = [
    {
        key: '1',
        title: 'Welcome to\nPoemify!',
        image: require('../assets/icon.png'),
    },
    {
        key: '2',
        title: 'Sign Up',
        image: require('../assets/screenshots/1ios.png'),
    },
    {
        key: '3',
        title: 'Write Your Poem',
        image: require('../assets/screenshots/2ios.png'),
    },
    {
        key: '4',
        title: "Like and View\nOther User's Poems",
        image: require('../assets/screenshots/3ios.png'),
    },
    {
        key: '5',
        title: 'Follow Other Users',
        image: require('../assets/screenshots/4ios.png'),
    },
    {
        key: '6',
        title: 'Bookmark Poems',
        image: require('../assets/screenshots/5ios.png'),
    },
];

function Intro(props: Props) {
    let _renderItem = ({ item }: any) => {
        return (
            <View style={styles.slide}>
                <Image resizeMode="contain" style={styles.image} source={item.image} />
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    };
    return (
        <AppIntroSlider
            renderItem={_renderItem}
            //@ts-ignore
            data={slides}
            onDone={async () => {
                props.navigation.navigate('Enterance');
                let user: User = {
                    bookmarks: [],
                    blockedUsers: [],
                    topics: [],
                    totalPoems: 0,
                    uid: '',
                    docid: '-1',
                    email: '',
                    username: '',
                    poems: [],
                    preferredLanguages: [],
                    followers: [],
                    following: [],
                };
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }}
        />
    );
}

export default Intro;

const styles = StyleSheet.create({
    slide: {
        height: '100%',
        paddingBottom: '20%',
        backgroundColor: '#b7c8dd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    image: {
        width: '55%',
        height: '80%',
    },
});
