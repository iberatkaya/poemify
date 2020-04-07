import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, TextInput, Subheading, Button, HelperText, IconButton, ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import EmailValidator from 'email-validator';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { User } from '../interfaces/User';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { EnteranceStackParamList } from 'AppNav';
import { StackNavigationProp } from '@react-navigation/stack';
import { usersCollectionId } from '../constants/collection';

type EnteranceScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'Login'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    setUser,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: EnteranceScreenNavigationProp;
};

function Login(props: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([
        { error: false, msg: '' },
        { error: false, msg: '' },
    ]);
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Login</Title>
            <Subheading>Welcome back!</Subheading>
            <View style={styles.textinput}>
                <TextInput
                    returnKeyType="done"
                    error={errors[0].error}
                    label="Email"
                    mode="outlined"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                {errors[0].error ? <HelperText style={styles.errorText}>{errors[0].msg}</HelperText> : <View />}
            </View>
            <View style={styles.textinputLast}>
                <TextInput
                    returnKeyType="done"
                    error={errors[1].error}
                    label="Password"
                    secureTextEntry={true}
                    mode="outlined"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                {errors[1].error ? <HelperText style={styles.errorText}>{errors[1].msg}</HelperText> : <View />}
            </View>
            <Text style={styles.helperText} onPress={() => props.navigation.navigate('ResetPassword')}>
                Forgot your password?
            </Text>
            {!loading ? (
                <Button
                    mode="contained"
                    dark={true}
                    labelStyle={styles.buttonLabel}
                    onPress={async () => {
                        let myerrors = [...errors];
                        let hasError = false;
                        if (email === '') {
                            myerrors[0] = { error: true, msg: 'Email cannot be empty!' };
                            hasError = true;
                        } else if (!EmailValidator.validate(email)) {
                            myerrors[0] = { error: true, msg: 'Not a valid email!' };
                            hasError = true;
                        } else {
                            myerrors[0] = { error: false, msg: '' };
                        }
                        if (password === '') {
                            myerrors[1] = { error: true, msg: 'Password cannot be empty!' };
                            hasError = true;
                        } else if (password.length < 6) {
                            myerrors[1] = { error: true, msg: 'Password must be longer than 5 characters!' };
                            hasError = true;
                        } else {
                            myerrors[1] = { error: false, msg: '' };
                        }
                        setErrors(myerrors);
                        if (!hasError) {
                            setLoading(true);
                            try {
                                await auth().signInWithEmailAndPassword(email, password);
                                let res = await firestore().collection(usersCollectionId).where('email', '==', email).get();
                                let user = { ...res.docs[0].data(), id: res.docs[0].data().id };
                                props.setUser(user as User);
                                await AsyncStorage.setItem('user', JSON.stringify(user));
                                /**
                                 * Reset State since logging out returns to last page in the drawer stack
                                 */
                                setEmail('');
                                setPassword('');
                                setLoading(false);
                            } catch (e) {
                                console.log(e);
                                setErrors([
                                    { error: true, msg: 'Incorrect email or password!' },
                                    { error: true, msg: 'Incorrect email or password!' },
                                ]);
                                setLoading(false);
                            }
                        } else {
                            setLoading(false);
                        }
                    }}
                >
                    Login
                </Button>
            ) : (
                <ActivityIndicator style={{marginTop: 24}} size={50} />
            )}
            <IconButton onPress={() => props.navigation.navigate('Enterance')} style={styles.arrowBack} icon="arrow-left" size={32} />
        </View>
    );
}

export default connector(Login);

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        paddingTop: 2,
        textAlign: 'center',
        fontSize: 32,
        marginBottom: 32,
    },
    textinput: {
        marginBottom: 20,
    },
    buttonLabel: {
        paddingVertical: 6,
    },
    textinputLast: {},
    errorText: {
        fontSize: 13,
        color: 'red',
        marginTop: 4,
        marginBottom: 4,
    },
    helperText: {
        color: '#555',
        fontSize: 13,
        textAlign: 'right',
        marginTop: 6,
        marginBottom: 24,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: 4,
    },
});
