import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, HelperText, IconButton, ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import EmailValidator from 'email-validator';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import auth from '@react-native-firebase/auth';
import { EnteranceStackParamList } from 'AppNav';
import { StackNavigationProp } from '@react-navigation/stack';

type EnteranceScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'ResetPassword'>;

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

function ResetPassword(props: Props) {
    const [email, setEmail] = useState('');
    const [errorObj, setErrorObj] = useState({ error: false, msg: '' });
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.textinput}>
                <TextInput
                    returnKeyType="done"
                    error={errorObj.error}
                    label="Email"
                    mode="outlined"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                {errorObj.error ? <HelperText style={styles.errorText}>{errorObj.msg}</HelperText> : <View />}
            </View>
            {!loading ? (
                <Button
                    mode="contained"
                    dark={true}
                    labelStyle={styles.buttonLabel}
                    onPress={async () => {
                        let myerrors = { ...errorObj };
                        let hasError = false;
                        if (email === '') {
                            myerrors = { error: true, msg: 'Email cannot be empty!' };
                            hasError = true;
                        } else if (!EmailValidator.validate(email)) {
                            myerrors = { error: true, msg: 'Not a valid email!' };
                            hasError = true;
                        } else {
                            myerrors = { error: false, msg: '' };
                        }
                        setErrorObj(myerrors);
                        if (!hasError) {
                            setLoading(true);
                            try {
                                await auth().sendPasswordResetEmail(email);
                                setEmail('');
                                setLoading(false);
                            } catch (e) {
                                console.log(e);
                                setErrorObj({ error: true, msg: 'An email linked to this account was not found!' });
                                setLoading(false);
                            }
                        } else {
                            setLoading(false);
                        }
                    }}
                >
                    Reset
                </Button>
            ) : (
                <ActivityIndicator size={50} />
            )}
            <IconButton onPress={() => props.navigation.navigate('Enterance')} style={styles.arrowBack} icon="arrow-left" size={32} />
        </View>
    );
}

export default connector(ResetPassword);

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
    errorText: {
        fontSize: 13,
        color: 'red',
        marginTop: 4,
        marginBottom: 4,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: 4,
    },
});
