import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Title, Subheading, Button, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from '../interfaces/User';
import { DrawerParamList, EnteranceStackParamList } from '../AppNav';


type EnteranceScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList, 'EnteranceStack'>,
    StackNavigationProp<EnteranceStackParamList>
>

type Props = {
    navigation: EnteranceScreenNavigationProp;
};

function Enterance(props: Props) {

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Welcome</Title>
            <Subheading style={styles.subtitle}>Start writing and publishing your poems today!</Subheading>
            <Button mode="contained" dark={true} style={styles.button} labelStyle={styles.buttonLabel}
                onPress={() => { props.navigation.navigate('Login') }}
            >Login</Button>
            <Button mode="contained" dark={true} style={styles.button} labelStyle={styles.buttonLabel}
                onPress={() => props.navigation.navigate('Signup')}
            >Sign up</Button>
        </View>
    )
}

export default Enterance;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 24,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        marginBottom: 12
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24
    },
    textinput: {
    },
    button: {
        marginBottom: 24,
    },
    buttonLabel: {
        paddingVertical: 6
    },
    textinputLast: {

    },
    helperText: {
        fontSize: 13,
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 24
    }
})
