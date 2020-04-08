import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, Subheading, Button, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList, EnteranceStackParamList } from '../AppNav';
import RNBootSplash from "react-native-bootsplash";
import AsyncStorage from '@react-native-community/async-storage';

type EnteranceScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList, 'EnteranceStack'>,
    StackNavigationProp<EnteranceStackParamList>
>;

type Props = {
    navigation: EnteranceScreenNavigationProp;
};

function Enterance(props: Props) {

    useEffect(() => {
        let func = async () => {
            let getuser = await AsyncStorage.getItem('user');
            let usr = getuser !== null ? JSON.parse(getuser) : null;
            if(usr === null){
                console.log("intro");
                props.navigation.navigate('Intro');
                RNBootSplash.hide({ duration: 350 });
            }
            else if (usr.username === '') {
                RNBootSplash.hide({ duration: 350 });
            }
        };
        func();
    })

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Welcome</Title>
            <Subheading style={styles.subtitle}>Start writing and publishing your poems today!</Subheading>
            <Button
                mode="contained"
                dark={true}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={() => {
                    props.navigation.navigate('Login');
                }}
            >
                Login
            </Button>
            <Button
                mode="contained"
                dark={true}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={() => props.navigation.navigate('Signup')}
            >
                Sign up
            </Button>
        </View>
    );
}

export default Enterance;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        marginBottom: 12,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        marginBottom: 24,
    },
    buttonLabel: {
        paddingVertical: 6,
    },
    helperText: {
        fontSize: 13,
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 24,
    },
});
