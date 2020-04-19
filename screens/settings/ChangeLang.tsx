import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { User } from '../../interfaces/User';
import { Language } from 'interfaces/Language';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../../redux/actions/User';
import { RootState } from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { usersCollectionId } from '../../constants/collection';
import { allLangs } from '../../constants/language';
import { ProfileStackParamList } from '../../AppNav';
import { StackNavigationProp } from '@react-navigation/stack';

type EnteranceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ChangeLang'>;

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

function ChangeLang(props: Props) {
    let arr: Array<Language | null> = [];
    for (let i = 0; i < 3; i++) {
        if (props.user.preferredLanguages.length > i) arr.push(props.user.preferredLanguages[i]);
        else arr.push(null);
    }
    const [langs, setLangs] = useState<Array<Language | null>>(arr);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Change your languages</Text>
            <View>
                <Text style={styles.langText}>Primary Language</Text>
                <View style={styles.langContainer}>
                    <RNPickerSelect
                        items={allLangs.filter((i) => i !== langs[1] && i !== langs[2]).map((i) => ({ value: i, label: i }))}
                        placeholder={{}}
                        value={langs[0]}
                        style={pickerSelectStyles}
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
                        placeholder={{ label: 'Select your second language.' }}
                        style={pickerSelectStyles}
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
            <View>
                <Text style={styles.langText}>Third Language (Optional)</Text>
                <View style={styles.langContainer}>
                    <RNPickerSelect
                        items={allLangs.filter((i) => i !== langs[0] && i !== langs[1]).map((i) => ({ value: i, label: i }))}
                        placeholder={{ label: 'Select your third language.' }}
                        value={langs[2]}
                        style={pickerSelectStyles}
                        placeholderTextColor="#555"
                        onValueChange={(val) => {
                            let lang = [...langs];
                            lang[2] = val;
                            setLangs(lang);
                        }}
                    />
                </View>
            </View>
            <Button
                mode="contained"
                dark={true}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    let filtered = langs.filter((i) => i !== null) as Array<Language>;
                    let user: User = { ...props.user };
                    user.preferredLanguages = filtered;
                    await firestore().collection(usersCollectionId).doc(props.user.docid).update({ preferredLanguages: filtered });

                    props.setUser(user);
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                    props.navigation.goBack();
                }}
            >
                Save
            </Button>
        </ScrollView>
    );
}

export default connector(ChangeLang);

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    textinput: {
        marginBottom: 16,
    },
    textinputLast: {
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
    langText: {
        marginLeft: 4,
        marginBottom: 2,
        fontSize: 14,
        color: '#666',
    },
    langContainer: {
        borderColor: '#888',
        marginBottom: 24,
        borderWidth: 1,
        borderRadius: 12,
    },
    helperText: {
        fontSize: 13,
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 24,
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
