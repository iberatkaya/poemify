import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Platform } from 'react-native';
import { Title, TextInput, Subheading, Button, HelperText, IconButton, Text } from 'react-native-paper';
import EmailValidator from 'email-validator';
import RNPickerSelect from 'react-native-picker-select';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { FirebaseUser } from '../interfaces/User';
import { Language } from 'interfaces/Language';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { usersCollectionId } from '../constants/collection';
import { allLangs } from '../constants/language';
import { EnteranceStackParamList } from 'AppNav';
import Toast from 'react-native-simple-toast';
import { production } from '../constants/collection';
import { StackNavigationProp } from '@react-navigation/stack';

type EnteranceScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'Signup'>;

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

function Signup(props: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([
        { error: false, msg: '' },
        { error: false, msg: '' },
        { error: false, msg: '' },
        { error: false, msg: '' },
        { error: false, msg: '' },
    ]);
    const [langs, setLangs] = useState<Array<Language | null>>(['English', null, null]);
    const [loading, setLoading] = useState(false);
    const [lock, setLock] = useState(false);
    const [checked, setChecked] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.title}>Sign Up</Title>
            <Subheading>Welcome to Poemify!</Subheading>
            <View style={styles.textinput}>
                <TextInput
                    returnKeyType="done"
                    textContentType="username"
                    autoCapitalize="none"
                    label="Username"
                    error={errors[0].error}
                    onEndEditing={async () => {
                        try {
                            setLock(true);
                            let usernameIsTaken = await firestore().collection(usersCollectionId).where('username', '==', username).get();
                            if (!usernameIsTaken.empty) {
                                let newerrors = [...errors];
                                newerrors[0] = { error: true, msg: 'Username is already taken' };
                                setErrors(newerrors);
                                return;
                            } else {
                                let newerrors = [...errors];
                                newerrors[0] = { error: false, msg: '' };
                                setErrors(newerrors);
                                setLock(false);
                                return;
                            }
                        } catch (e) {
                            Toast.show('Please check your internet connection!');
                            setLock(false);
                            console.log(e);
                        }
                    }}
                    mode="outlined"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                {errors[0].error ? <HelperText style={styles.errorText}>{errors[0].msg}</HelperText> : <View />}
            </View>
            <View style={styles.textinput}>
                <TextInput
                    returnKeyType="done"
                    autoCapitalize="none"
                    textContentType="password"
                    label="Password"
                    error={errors[1].error}
                    secureTextEntry={true}
                    mode="outlined"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                {errors[1].error ? <HelperText style={styles.errorText}>{errors[1].msg}</HelperText> : <View />}
            </View>
            <View style={styles.textinputLast}>
                <TextInput
                    returnKeyType="done"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    label="Email"
                    error={errors[2].error}
                    keyboardType="email-address"
                    mode="outlined"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                {errors[2].error ? <HelperText style={styles.errorText}>{errors[2].msg}</HelperText> : <View />}
            </View>
            <View>
                <Text style={styles.langText}>Primary Language</Text>
                <View style={styles.langContainer}>
                    <RNPickerSelect
                        items={allLangs.filter((i) => i !== langs[1] && i !== langs[2]).map((i) => ({ value: i, label: i }))}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        value={langs[0]}
                        placeholderTextColor="#555"
                        onValueChange={(val) => {
                            let lang = [...langs];
                            lang[0] = val;
                            setLangs(lang);
                        }}
                    />
                </View>
            </View>
            <View>
                <Text style={styles.langText}>Second Language (Optional)</Text>
                <View style={styles.langContainer}>
                    <RNPickerSelect
                        items={allLangs.filter((i) => i !== langs[0] && i !== langs[2]).map((i) => ({ value: i, label: i }))}
                        style={pickerSelectStyles}
                        placeholder={{ label: 'Select your second language' }}
                        value={langs[1]}
                        placeholderTextColor="#555"
                        onValueChange={(val) => {
                            let lang = [...langs];
                            lang[1] = val;
                            setLangs(lang);
                        }}
                    />
                </View>
            </View>
            {langs[1] != null ? (
                <View>
                    <Text style={styles.langText}>Third Language (Optional)</Text>
                    <View style={styles.langContainer}>
                        <RNPickerSelect
                            items={allLangs.filter((i) => i !== langs[0] && i !== langs[1]).map((i) => ({ value: i, label: i }))}
                            placeholder={{ label: 'Select your third language' }}
                            style={pickerSelectStyles}
                            value={langs[2]}
                            placeholderTextColor="#555"
                            onValueChange={(val) => {
                                let lang = [...langs];
                                lang[2] = val;
                                setLangs(lang);
                            }}
                        />
                    </View>
                </View>
            ) : (
                <View />
            )}
            <Button
                mode="outlined"
                dark={true}
                labelStyle={errors[3].error ? { ...styles.buttonLabel, color: 'red' } : styles.buttonLabel}
                onPress={() => props.navigation.navigate('SelectTopics')}
            >
                {props.user.topics.length < 1 ? 'Select your topics' : 'Selected ' + props.user.topics.length.toString() + ' topics'}
            </Button>

            {errors[3].error ? <HelperText style={styles.errorText}>{errors[3].msg}</HelperText> : <View />}

            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 6}}>
                <Text style={{color: "#333"}}>Agree to the <Text onPress={() => props.navigation.navigate("TOS")} style={{textDecorationLine: "underline"}}>Terms of Service</Text>: </Text>
                <IconButton
                    style={{borderWidth: 1}}
                    size={24}
                    icon={ checked ? "check" : "close"}
                    onPress={() => { setChecked(!checked); }}
                />
            </View>
            {errors[4].error ? <HelperText style={styles.errorText}>{errors[4].msg}</HelperText> : <View />}
            <Button
                mode="contained"
                loading={loading}
                disabled={lock}
                dark={true}
                labelStyle={styles.buttonLabel}
                style={styles.signupButton}
                onPress={async () => {
                    if (loading) return;
                    setLoading(true);
                    let myerrors = [...errors];
                    if (username === '') {
                        myerrors[0] = { error: true, msg: 'Username cannot be empty!' };
                    } else if (username.length < 5) {
                        myerrors[0] = { error: true, msg: 'Username must be longer than 4 characters!' };
                    } else {
                        myerrors[0] = { error: false, msg: '' };
                    }
                    if (password === '') {
                        myerrors[1] = { error: true, msg: 'Password cannot be empty!' };
                    } else if (password.length < 6) {
                        myerrors[1] = { error: true, msg: 'Password must be longer than 5 characters!' };
                    } else {
                        myerrors[1] = { error: false, msg: '' };
                    }
                    if (email === '') {
                        myerrors[2] = { error: true, msg: 'Email cannot be empty!' };
                    } else if (!EmailValidator.validate(email)) {
                        myerrors[2] = { error: true, msg: 'Not a valid email!' };
                    } else {
                        myerrors[2] = { error: false, msg: '' };
                    }
                    if (props.user.topics.length < 2) {
                        myerrors[3] = { error: true, msg: 'Select at least 2 topics!' };
                    } else {
                        myerrors[3] = { error: false, msg: '' };
                    }
                    if (!checked) {
                        myerrors[4] = { error: true, msg: 'Please accept the Terms of Service!' };
                    } else {
                        myerrors[4] = { error: false, msg: '' };
                    }
                    setErrors(myerrors);
                    if (!myerrors[0].error && !myerrors[1].error && !myerrors[2].error && !myerrors[3].error && !myerrors[4].error) {
                        try {
                            let filtered = langs.filter((i) => i !== null) as Array<Language>;
                            let res = await auth().createUserWithEmailAndPassword(email, password);
                            if (!res.additionalUserInfo?.isNewUser) {
                                setErrors([
                                    { error: true, msg: 'Username is already taken' },
                                    { error: false, msg: '' },
                                    { error: false, msg: '' },
                                    { error: false, msg: '' },
                                    { error: false, msg: '' }
                                ]);
                                setLoading(false);
                                return;
                            }

                            let unsub = production
                                ? auth().onAuthStateChanged((usr) => {
                                      if (!usr?.emailVerified) {
                                          usr?.sendEmailVerification();
                                      }
                                  })
                                : () => {};

                            let fuser: FirebaseUser = {
                                email: email,
                                uid: res.user.uid,
                                blockedUsers: [],
                                bookmarks: [],
                                totalPoems: 0,
                                username: username,
                                preferredLanguages: filtered,
                                poems: [],
                                followers: [],
                                following: [],
                                topics: [...props.user.topics],
                            };
                            let res2 = await firestore().collection(usersCollectionId).add(fuser);

                            let res3 = await firestore().collection(usersCollectionId).doc(res2.id).update({ docid: res2.id });
                            unsub();
                            Toast.show('Please authenticate your email.');
                            props.navigation.navigate('Login');
                            //props.setUser(user);
                            //await AsyncStorage.setItem('user', JSON.stringify(user));
                            /**
                             * Reset State since logging out returns to last page in the drawer stack
                             */
                            //setUsername('');
                            //setPassword('');
                            //setEmail('');
                            //setLoading(false);
                            //setLangs(['English', null, null]);
                        } catch (e) {
                            if (
                                e.message ===
                                '[auth/unknown] A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
                            ) {
                                Toast.show('Please check your internet connection!');
                                setLoading(false);
                                return;
                            } else if (
                                e.message === '[auth/email-already-in-use] The email address is already in use by another account.'
                            ) {
                                setErrors([
                                    { error: false, msg: '' },
                                    { error: false, msg: '' },
                                    { error: true, msg: 'The email address is already used!' },
                                    { error: false, msg: '' },
                                    { error: false, msg: '' },
                                ]);
                                setLoading(false);
                            } else Toast.show('An error occurred');
                            console.log(e.message);
                        }
                    } else {
                        setLoading(false);
                    }
                }}
            >
                Sign up
            </Button>
            <IconButton onPress={() => props.navigation.navigate('Enterance')} style={styles.arrowBack} icon="arrow-left" size={32} />
        </ScrollView>
    );
}

export default connector(Signup);

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 64 : 40,
        paddingBottom: 16,
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
        marginBottom: 16,
    },
    textinputLast: {
        marginBottom: 16,
    },
    buttonLabel: {
        paddingVertical: 6,
    },
    signupButton: {
        marginTop: 16,
    },
    errorText: {
        fontSize: 13,
        color: 'red',
        marginTop: 4,
        marginBottom: 4,
    },
    langText: {
        marginLeft: 4,
        marginBottom: 2,
        fontSize: 14,
        color: '#666',
    },
    langContainer: {
        borderColor: '#888',
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 12,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: Platform.OS === 'ios' ? 36 : 4,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    inputAndroid: {},
});
